import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const StockChart = ({ data, symbol }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();
    const [tooltipContent, setTooltipContent] = useState(null);

    useEffect(() => {
        if (!data || data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            console.warn("StockChart: No data or empty data received.");
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
        })).filter(d => d.date && d.close !== undefined);

        console.log("Parsed data for D3:", parsedData); // <--- Add this

        if (parsedData.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            console.warn("StockChart: Parsed data is empty after filtering.");
            return;
        }

        parsedData.sort((a, b) => a.date - b.date);

        const margin = { top: 30, right: 80, bottom: 40, left: 60 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // КЛУЧНО: Осигурајте се дека доменот е валиден
        const xDomain = d3.extent(parsedData, d => d.date);
        const yMin = d3.min(parsedData, d => d.low);
        const yMax = d3.max(parsedData, d => d.high);

        // Дополнителна проверка за валидност на доменот на Y-оската
        if (isNaN(yMin) || isNaN(yMax) || yMin === yMax) {
            console.error("StockChart: Invalid Y-axis domain values (yMin, yMax). Check your data for non-numeric values or constant price.");
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            return;
        }

        const x = d3.scaleTime()
            .domain(xDomain)
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([yMin * 0.95, yMax * 1.05])
            .range([height, 0]);


        const xAxis = g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat("%Y-%m-%d")));

        // eslint-disable-next-line no-unused-vars
        const yAxis = g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(10));


        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close));

        const path = g.append("path")
            .datum(parsedData)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line)
            .attr("clip-path", "url(#clip)");


        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .extent([[0, 0], [width, height]])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        // eslint-disable-next-line no-unused-vars
        const rect = g.append("rect")
            .attr("class", "zoom-overlay")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(zoom);

        function zoomed(event) {
            const newXScale = event.transform.rescaleX(x);
            xAxis.call(d3.axisBottom(newXScale).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat("%Y-%m-%d")));
            path.attr("d", d3.line()
                .x(d => newXScale(d.date))
                .y(d => y(d.close))
            );
            g.selectAll(".dot")
                .attr("cx", d => newXScale(d.date));

            g.property("transform", event.transform);
        }


        const bisectDate = d3.bisector(d => d.date).left;

        const focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        g.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => {
                focus.style("display", "none");
                setTooltipContent(null);
            })
            .on("mousemove", mousemove);

        function mousemove(event) {
            const x0 = x.invert(d3.pointer(event)[0]);
            const i = bisectDate(parsedData, x0, 1);

            const d0 = parsedData[i - 1];
            const d1 = parsedData[i];

            let d;
            if (d0 && d1) {
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            } else if (d0) {
                d = d0;
            } else if (d1) {
                d = d1;
            } else {
                setTooltipContent(null);
                focus.style("display", "none");
                return;
            }

            if (!d.date || isNaN(d.close) || isNaN(d.open) || isNaN(d.high) || isNaN(d.low) || isNaN(d.volume)) {
                setTooltipContent(null);
                focus.style("display", "none");
                return;
            }

            const currentXScale = g.property("transform") ? d3.zoomTransform(g.node()).rescaleX(x) : x;
            focus.attr("transform", `translate(${currentXScale(d.date)},${y(d.close)})`);

            setTooltipContent({
                date: d3.timeFormat("%Y-%m-%d")(d.date),
                open: d.open.toFixed(2),
                high: d.high.toFixed(2),
                low: d.low.toFixed(2),
                close: d.close.toFixed(2),
                volume: d.volume.toLocaleString()
            });
        }

        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2) + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(`Дневна цена на затворање за ${symbol}`);

    }, [data, symbol]);

    return (
        <div>
            {data && data.length > 0 ? (
                <div style={{ position: 'relative' }}>
                    <svg ref={svgRef}></svg>
                    {tooltipContent && (
                        <div
                            ref={tooltipRef}
                            className="stock-tooltip"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                pointerEvents: 'none',
                                zIndex: 10,
                                textAlign: 'left',
                                minWidth: '150px'
                            }}
                        >
                            <p><strong>Датум:</strong> {tooltipContent.date}</p>
                            <p><strong>Отворање:</strong> {tooltipContent.open}</p>
                            <p><strong>Највисока:</strong> {tooltipContent.high}</p>
                            <p><strong>Најниска:</strong> {tooltipContent.low}</p>
                            <p><strong>Затворање:</strong> {tooltipContent.close}</p>
                            <p><strong>Волумен:</strong> {tooltipContent.volume}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>Внесете симбол и пребарајте за да видите график.</p>
            )}
        </div>
    );
};

export default StockChart;