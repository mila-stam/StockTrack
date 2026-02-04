import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './StockChart.module.css';

const StockChart = ({ data, symbol, onDataClick }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll('*').remove();
            return;
        }

        const parseDate = d3.timeParse('%Y-%m-%d');

        const parsedData = data
            .map(d => ({
                date: parseDate(d.date),
                open: +d.open,
                high: +d.high,
                low: +d.low,
                close: +d.close,
                volume: +d.volume,
            }))
            .filter(d => d.date && !isNaN(d.open))
            .sort((a, b) => a.date - b.date);

        if (parsedData.length === 0) return;

        const margin = { top: 30, right: 40, bottom: 60, left: 60 };
        const height = 500;
        const containerWidth = svgRef.current.parentElement.clientWidth;
        const width = containerWidth - margin.left - margin.right;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const chart = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

    
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);

        xScale.domain(d3.extent(parsedData, d => d.date));
        yScale.domain([
            d3.min(parsedData, d => d.low) * 0.98,
            d3.max(parsedData, d => d.high) * 1.02,
        ]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const xAxisGroup = chart
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        const yAxisGroup = chart.append('g').call(yAxis);

        xAxisGroup
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        chart
            .append('g')
            .attr('class', styles.grid)
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

        const candleWidth = Math.max(4, width / parsedData.length * 0.7);

        const wicks = chart
            .selectAll('.wick')
            .data(parsedData)
            .enter()
            .append('line')
            .attr('class', styles.candlestickWick);

        const bodies = chart
            .selectAll('.body')
            .data(parsedData)
            .enter()
            .append('rect')
            .attr('class', d =>
                d.close >= d.open
                    ? styles.candlestickBodyUp
                    : styles.candlestickBodyDown
            )
            .style('cursor', 'pointer')
            .on('click', (_, d) => {
                if (onDataClick) {
                    onDataClick({
                        date: d3.timeFormat('%Y-%m-%d')(d.date),
                        open: d.open,
                        high: d.high,
                        low: d.low,
                        close: d.close,
                        volume: d.volume,
                    });
                }
            });

        function renderCandles(x, y) {
            wicks
                .attr('x1', d => x(d.date))
                .attr('x2', d => x(d.date))
                .attr('y1', d => y(d.high))
                .attr('y2', d => y(d.low));

            bodies
                .attr('x', d => x(d.date) - candleWidth / 2)
                .attr('y', d => y(Math.max(d.open, d.close)))
                .attr('width', candleWidth)
                .attr('height', d =>
                    Math.abs(y(d.open) - y(d.close))
                );
        }

        renderCandles(xScale, yScale);

        const zoom = d3
            .zoom()
            .scaleExtent([1, 20])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', event => {
                const zx = event.transform.rescaleX(xScale);
                const zy = event.transform.rescaleY(yScale);

                renderCandles(zx, zy);
                xAxisGroup.call(xAxis.scale(zx));
                yAxisGroup.call(yAxis.scale(zy));
            });

        svg.call(zoom);

    }, [data, symbol, onDataClick]);

    return (
        <div className={styles.chartContainer}>
            <svg ref={svgRef} />
        </div>
    );
};

export default StockChart;
