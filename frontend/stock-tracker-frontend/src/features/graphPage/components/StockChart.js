// src/features/graphPage/components/StockChart.js
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './StockChart.module.css';

const StockChart = ({ data, symbol }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();
    const zoomSliderRef = useRef(null);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [clickedData, setClickedData] = useState(null);

    useEffect(() => {
        let currentZoomTransform = d3.zoomIdentity;

        const updateSlider = (transform) => {
            const sliderScale = d3.scaleLinear()
                .domain([1, 20])
                .range([0, 100]);
            if (zoomSliderRef.current) {
                zoomSliderRef.current.value = sliderScale(transform.k);
            }
        };

        function zoomed(event) {
            currentZoomTransform = event.transform;
            const newXScale = currentZoomTransform.rescaleX(xScale);
            const newYScale = currentZoomTransform.rescaleY(yScale);

            updateCandlesticks(newXScale, newYScale);

            xAxisGroup.call(xAxis.scale(newXScale));
            priceYAxisGroup.call(priceYAxis.scale(newYScale));

            priceYGrid.call(d3.axisLeft(newYScale)
                .tickSize(-width)
                .tickFormat("")
            );
            priceXGrid.call(d3.axisBottom(newXScale)
                .tickSize(-chartHeight)
                .tickFormat("")
            );

            xAxisGroup.selectAll("text")
                .attr("transform", `rotate(-45)`)
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em");

            if (zoomSliderRef.current) {
                updateSlider(currentZoomTransform);
            }
        }

        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            setClickedData(null);
            return;
        }

        const parseDate = d3.timeParse("%Y-%m-%d");

        const parsedData = data.map(d => ({
            date: parseDate(d.date),
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close,
            volume: +d.volume
        }))
            .filter(d => d.date && d.open !== undefined && !isNaN(d.open) &&
                d.high !== undefined && !isNaN(d.high) &&
                d.low !== undefined && !isNaN(d.low) &&
                d.close !== undefined && !isNaN(d.close))
            .sort((a, b) => a.date - b.date);

        if (parsedData.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            setClickedData(null);
            return;
        }

        const margin = { top: 30, right: 80, bottom: 60, left: 60 };
        const chartHeight = 500;
        const totalHeight = chartHeight;
        const containerWidth = svgRef.current.parentElement.clientWidth;
        const width = Math.max(1, containerWidth - margin.left - margin.right);

        if (width <= 0 || totalHeight <= 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            setClickedData(null);
            return;
        }

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", totalHeight + margin.top + margin.bottom)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${totalHeight + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const priceFocus = svg.append("g")
            .attr("class", "price-focus")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([chartHeight, 0]);

        const initialXDomain = d3.extent(parsedData, d => d.date);
        xScale.domain(initialXDomain);
        yScale.domain([d3.min(parsedData, d => d.low) * 0.95, d3.max(parsedData, d => d.high) * 1.05]);

        const xAxis = d3.axisBottom(xScale);
        const priceYAxis = d3.axisLeft(yScale);

        priceFocus.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", chartHeight);

        const priceYGrid = priceFocus.append("g")
            .attr("class", styles.grid)
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat("")
            );
        const priceXGrid = priceFocus.append("g")
            .attr("class", `${styles.grid} ${styles.verticalGrid}`)
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-chartHeight)
                .tickFormat("")
            );

        const candlestickWidth = Math.max(1.5, width / parsedData.length * 0.9);

        const wicks = priceFocus.selectAll(".candlestick-wick")
            .data(parsedData)
            .enter().append("line")
            .attr("class", styles.candlestickWick)
            .attr("clip-path", "url(#clip)");

        const candlestickBodies = priceFocus.selectAll(".candlestick-body")
            .data(parsedData)
            .enter().append("rect")
            .attr("class", d => d.close > d.open ? styles.candlestickBodyUp : styles.candlestickBodyDown)
            .attr("clip-path", "url(#clip)");

        function updateCandlesticks(currentXScale, currentYScale) {
            wicks
                .attr("x1", d => currentXScale(d.date))
                .attr("y1", d => currentYScale(d.high))
                .attr("x2", d => currentXScale(d.date))
                .attr("y2", d => currentYScale(d.low));

            candlestickBodies
                .attr("x", d => currentXScale(d.date) - candlestickWidth / 2)
                .attr("y", d => currentYScale(Math.max(d.open, d.close)))
                .attr("width", candlestickWidth)
                .attr("height", d => Math.abs(currentYScale(d.open) - currentYScale(d.close)));
        }

        const xAxisGroup = svg.append("g")
            .attr("class", styles.xAxis)
            .attr("transform", `translate(${margin.left},${margin.top + totalHeight})`)
            .call(xAxis);

        const priceYAxisGroup = priceFocus.append("g")
            .attr("class", styles.yAxis)
            .call(priceYAxis);

        const tooltipFocus = priceFocus.append("g")
            .attr("class", styles.tooltipFocus)
            .style("display", "none");

        tooltipFocus.append("line")
            .attr("class", `${styles.hoverLine} ${styles.xHoverLine}`)
            .attr("y1", 0)
            .attr("y2", chartHeight);

        tooltipFocus.append("circle")
            .attr("class", styles.priceFocusCircle)
            .attr("r", 5);

        const zoom = d3.zoom()
            .scaleExtent([1, 20])
            .extent([[0, 0], [width, totalHeight]])
            .translateExtent([[0, 0], [width, totalHeight]])
            .on("zoom", zoomed);

        const lastDate = parsedData[parsedData.length - 1].date;
        const oneYearAgo = d3.timeYear.offset(lastDate, -1);
        const initialVisibleRange = parsedData.filter(d => d.date >= oneYearAgo);

        const initialXMin = initialVisibleRange.length > 0 ? initialVisibleRange[0].date : initialXDomain[0];
        const initialXMax = initialVisibleRange.length > 0 ? initialVisibleRange[initialVisibleRange.length - 1].date : initialXDomain[1];

        const initialTransform = d3.zoomIdentity
            .scale(width / (xScale(initialXMax) - xScale(initialXMin)))
            .translate(-xScale(initialXMin), 0);

        svg.call(zoom)
            .call(zoom.transform, initialTransform);

        if (zoomSliderRef.current) {
            d3.select(zoomSliderRef.current).on("input", function () {
                const sliderValue = +this.value;
                const newK = d3.scaleLinear().domain([0, 100]).range(zoom.scaleExtent())(sliderValue);

                const currentXScaleForCenter = currentZoomTransform.rescaleX(xScale);
                const currentYScaleForCenter = currentZoomTransform.rescaleY(yScale);

                const chartCenterX = width / 2;
                const chartCenterY = chartHeight / 2;

                const centerDataX = currentXScaleForCenter.invert(chartCenterX);
                const centerDataY = currentYScaleForCenter.invert(chartCenterY);

                const anchorScreenX = x
            }