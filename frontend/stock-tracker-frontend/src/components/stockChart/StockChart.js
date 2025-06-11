// import React, { useRef, useEffect, useState } from 'react';
// import * as d3 from 'd3';
//
// const StockChart = ({ data, symbol }) => {
//     const svgRef = useRef();
//     const tooltipRef = useRef();
//     const [tooltipContent, setTooltipContent] = useState(null);
//
//     useEffect(() => {
//         if (!data || data.length === 0) {
//             d3.select(svgRef.current).selectAll("*").remove();
//             setTooltipContent(null);
//             console.warn("StockChart: No data or empty data received.");
//             return;
//         }
//
//         const parseDate = d3.timeParse("%Y-%m-%d");
//         const parsedData = data.map(d => ({
//             date: parseDate(d.date),
//             open: +d.open,
//             high: +d.high,
//             low: +d.low,
//             close: +d.close,
//             volume: +d.volume
//         })).filter(d => d.date && d.close !== undefined);
//
//         console.log("Parsed data for D3:", parsedData); // <--- Add this
//
//         if (parsedData.length === 0) {
//             d3.select(svgRef.current).selectAll("*").remove();
//             setTooltipContent(null);
//             console.warn("StockChart: Parsed data is empty after filtering.");
//             return;
//         }
//
//         parsedData.sort((a, b) => a.date - b.date);
//
//         const margin = { top: 30, right: 80, bottom: 40, left: 60 };
//         const width = 960 - margin.left - margin.right;
//         const height = 500 - margin.top - margin.bottom;
//
//         const svg = d3.select(svgRef.current);
//         svg.selectAll("*").remove();
//
//         svg.attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom);
//
//         const g = svg.append("g")
//             .attr("transform", `translate(${margin.left},${margin.top})`);
//
//         g.append("defs").append("clipPath")
//             .attr("id", "clip")
//             .append("rect")
//             .attr("width", width)
//             .attr("height", height);
//
//         // КЛУЧНО: Осигурајте се дека доменот е валиден
//         const xDomain = d3.extent(parsedData, d => d.date);
//         const yMin = d3.min(parsedData, d => d.low);
//         const yMax = d3.max(parsedData, d => d.high);
//
//         // Дополнителна проверка за валидност на доменот на Y-оската
//         if (isNaN(yMin) || isNaN(yMax) || yMin === yMax) {
//             console.error("StockChart: Invalid Y-axis domain values (yMin, yMax). Check your data for non-numeric values or constant price.");
//             d3.select(svgRef.current).selectAll("*").remove();
//             setTooltipContent(null);
//             return;
//         }
//
//         const x = d3.scaleTime()
//             .domain(xDomain)
//             .range([0, width]);
//
//         const y = d3.scaleLinear()
//             .domain([yMin * 0.95, yMax * 1.05])
//             .range([height, 0]);
//
//
//         const xAxis = g.append("g")
//             .attr("class", "x-axis")
//             .attr("transform", `translate(0,${height})`)
//             .call(d3.axisBottom(x).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat("%Y-%m-%d")));
//
//         // eslint-disable-next-line no-unused-vars
//         const yAxis = g.append("g")
//             .attr("class", "y-axis")
//             .call(d3.axisLeft(y).ticks(10));
//
//
//         const line = d3.line()
//             .x(d => x(d.date))
//             .y(d => y(d.close));
//
//         const path = g.append("path")
//             .datum(parsedData)
//             .attr("class", "line-path")
//             .attr("fill", "none")
//             .attr("stroke", "steelblue")
//             .attr("stroke-width", 1.5)
//             .attr("d", line)
//             .attr("clip-path", "url(#clip)");
//
//
//         const zoom = d3.zoom()
//             .scaleExtent([1, 10])
//             .extent([[0, 0], [width, height]])
//             .translateExtent([[0, 0], [width, height]])
//             .on("zoom", zoomed);
//
//         // eslint-disable-next-line no-unused-vars
//         const rect = g.append("rect")
//             .attr("class", "zoom-overlay")
//             .attr("width", width)
//             .attr("height", height)
//             .style("fill", "none")
//             .style("pointer-events", "all")
//             .call(zoom);
//
//         function zoomed(event) {
//             const newXScale = event.transform.rescaleX(x);
//             xAxis.call(d3.axisBottom(newXScale).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat("%Y-%m-%d")));
//             path.attr("d", d3.line()
//                 .x(d => newXScale(d.date))
//                 .y(d => y(d.close))
//             );
//             g.selectAll(".dot")
//                 .attr("cx", d => newXScale(d.date));
//
//             g.property("transform", event.transform);
//         }
//
//
//         const bisectDate = d3.bisector(d => d.date).left;
//
//         const focus = g.append("g")
//             .attr("class", "focus")
//             .style("display", "none");
//
//         focus.append("circle")
//             .attr("r", 5);
//
//         g.append("rect")
//             .attr("class", "overlay")
//             .attr("width", width)
//             .attr("height", height)
//             .style("fill", "none")
//             .style("pointer-events", "all")
//             .on("mouseover", () => focus.style("display", null))
//             .on("mouseout", () => {
//                 focus.style("display", "none");
//                 setTooltipContent(null);
//             })
//             .on("mousemove", mousemove);
//
//         function mousemove(event) {
//             const x0 = x.invert(d3.pointer(event)[0]);
//             const i = bisectDate(parsedData, x0, 1);
//
//             const d0 = parsedData[i - 1];
//             const d1 = parsedData[i];
//
//             let d;
//             if (d0 && d1) {
//                 d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//             } else if (d0) {
//                 d = d0;
//             } else if (d1) {
//                 d = d1;
//             } else {
//                 setTooltipContent(null);
//                 focus.style("display", "none");
//                 return;
//             }
//
//             if (!d.date || isNaN(d.close) || isNaN(d.open) || isNaN(d.high) || isNaN(d.low) || isNaN(d.volume)) {
//                 setTooltipContent(null);
//                 focus.style("display", "none");
//                 return;
//             }
//
//             const currentXScale = g.property("transform") ? d3.zoomTransform(g.node()).rescaleX(x) : x;
//             focus.attr("transform", `translate(${currentXScale(d.date)},${y(d.close)})`);
//
//             setTooltipContent({
//                 date: d3.timeFormat("%Y-%m-%d")(d.date),
//                 open: d.open.toFixed(2),
//                 high: d.high.toFixed(2),
//                 low: d.low.toFixed(2),
//                 close: d.close.toFixed(2),
//                 volume: d.volume.toLocaleString()
//             });
//         }
//
//         g.append("text")
//             .attr("x", (width / 2))
//             .attr("y", 0 - (margin.top / 2) + 10)
//             .attr("text-anchor", "middle")
//             .style("font-size", "18px")
//             .style("font-weight", "bold")
//             .style("fill", "#333")
//             .text(`Дневна цена на затворање за ${symbol}`);
//
//     }, [data, symbol]);
//
//     return (
//         <div>
//             {data && data.length > 0 ? (
//                 <div style={{ position: 'relative' }}>
//                     <svg ref={svgRef}></svg>
//                     {tooltipContent && (
//                         <div
//                             ref={tooltipRef}
//                             className="stock-tooltip"
//                             style={{
//                                 position: 'absolute',
//                                 top: '10px',
//                                 right: '10px',
//                                 background: 'rgba(0, 0, 0, 0.7)',
//                                 color: 'white',
//                                 padding: '10px',
//                                 borderRadius: '5px',
//                                 pointerEvents: 'none',
//                                 zIndex: 10,
//                                 textAlign: 'left',
//                                 minWidth: '150px'
//                             }}
//                         >
//                             <p><strong>Датум:</strong> {tooltipContent.date}</p>
//                             <p><strong>Отворање:</strong> {tooltipContent.open}</p>
//                             <p><strong>Највисока:</strong> {tooltipContent.high}</p>
//                             <p><strong>Најниска:</strong> {tooltipContent.low}</p>
//                             <p><strong>Затворање:</strong> {tooltipContent.close}</p>
//                             <p><strong>Волумен:</strong> {tooltipContent.volume}</p>
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <p>Внесете симбол и пребарајте за да видите график.</p>
//             )}
//         </div>
//     );
// };
//
// export default StockChart;

// src/components/stockChart/StockChart.js

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './stockChart.css'; // Додај го StockChart.css

const StockChart = ({ data, symbol, indicator }) => {
    const svgRef = useRef();
    const tooltipRef = useRef(); // Референца за tooltip
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
            volume: +d.volume,
            // Важно: rsi може да биде null/undefined, третирај го со undefined за D3
            rsi: (d.rsi === null || isNaN(+d.rsi)) ? undefined : +d.rsi
        }))
            .filter(d => d.date && d.close !== undefined && !isNaN(d.close)) // Филтрирај невалидни податоци
            .sort((a, b) => a.date - b.date); // Сортирај по датум

        console.log("Parsed data for D3:", parsedData);

        if (parsedData.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            console.warn("StockChart: Parsed data is empty after filtering.");
            return;
        }

        const margin = { top: 30, right: 80, bottom: 60, left: 60 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Висина на горниот панел (цена) и долниот панел (RSI)
        const priceChartHeight = height * 0.7; // 70% од вкупната висина
        const rsiChartHeight = height * 0.3;  // 30% од вкупната висина

        // Офсет за RSI графикот (положба на долниот панел)
        const rsiChartYOffset = priceChartHeight + 40; // 40px размак меѓу графиците и оски

        // Отстрани ги сите претходни елементи од SVG пред да ги нацрташ новите
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // КЛУЧНО: Осигурајте се дека доменот е валиден
        const xDomain = d3.extent(parsedData, d => d.date);
        const yMin = d3.min(parsedData, d => d.low);
        const yMax = d3.max(parsedData, d => d.high);

        if (isNaN(yMin) || isNaN(yMax) || yMin === yMax) {
            console.error("StockChart: Invalid Y-axis domain values (yMin, yMax). Check your data for non-numeric values or constant price.");
            d3.select(svgRef.current).selectAll("*").remove();
            setTooltipContent(null);
            return;
        }

        // 1. Скали за цена (горе)
        const xScale = d3.scaleTime()
            .domain(xDomain)
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([yMin * 0.95, yMax * 1.05])
            .range([priceChartHeight, 0]); // Опсег само до priceChartHeight

        // 2. Скали за RSI (долу)
        const rsiYScale = d3.scaleLinear()
            .domain([0, 100]) // RSI е секогаш меѓу 0 и 100
            .range([rsiChartYOffset + rsiChartHeight, rsiChartYOffset]); // Опсег за RSI графикот

        // 3. Оски за цена
        const xAxis = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${priceChartHeight})`)
            .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(3)).tickFormat(d3.timeFormat("%Y-%m-%d")));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale).ticks(10));

        // 4. Оски за RSI (само ако индикаторот е RSI)
        if (indicator === 'RSI') {
            const rsiYAxis = svg.append("g")
                .attr("class", "rsi-y-axis")
                .attr("transform", `translate(0,0)`) // X трансформацијата е 0, Y офсетот е во rsiYScale
                .call(d3.axisLeft(rsiYScale).ticks(5));

            // RSI Overbought/Oversold линии
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", rsiYScale(70))
                .attr("x2", width)
                .attr("y2", rsiYScale(70))
                .attr("stroke", "red")
                .attr("stroke-dasharray", "4")
                .attr("stroke-width", 0.7);

            svg.append("text")
                .attr("x", width + 5)
                .attr("y", rsiYScale(70))
                .attr("dy", "0.32em")
                .style("text-anchor", "start")
                .style("font-size", "10px")
                .attr("fill", "red")
                .text("70");

            svg.append("line")
                .attr("x1", 0)
                .attr("y1", rsiYScale(30))
                .attr("x2", width)
                .attr("y2", rsiYScale(30))
                .attr("stroke", "green")
                .attr("stroke-dasharray", "4")
                .attr("stroke-width", 0.7);

            svg.append("text")
                .attr("x", width + 5)
                .attr("y", rsiYScale(30))
                .attr("dy", "0.32em")
                .style("text-anchor", "start")
                .style("font-size", "10px")
                .attr("fill", "green")
                .text("30");

            // Label за RSI графикот
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", rsiChartYOffset - 10) // Позиционирај над RSI графикот
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text("Relative Strength Index (RSI)");
        }

        // 5. Линија за цена на затворање
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.close));

        svg.append("path")
            .datum(parsedData)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // 6. Линија за RSI (само ако има податоци и е избран индикаторот)
        if (indicator === 'RSI') {
            const rsiLine = d3.line()
                .defined(d => d.rsi !== undefined) // Дефинирано само ако RSI не е undefined
                .x(d => xScale(d.date))
                .y(d => rsiYScale(d.rsi)); // Користи rsiYScale

            svg.append("path")
                .datum(parsedData)
                .attr("class", "rsi-line-path") // Додади класа за RSI линијата
                .attr("fill", "none")
                .attr("stroke", "purple")
                .attr("stroke-width", 1.5)
                .attr("d", rsiLine);
        }

        // 7. Tooltip и интерактивност
        const focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // Вертикална линија која се протега низ двата графика
        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height + 40); // Продолжи ја линијата до дното на RSI графикот

        // Хоризонтална линија за цена
        focus.append("line")
            .attr("class", "y-hover-line price-hover-line")
            .attr("x1", 0)
            .attr("x2", width);

        // Круг за цена
        focus.append("circle")
            .attr("class", "price-focus-circle")
            .attr("r", 5)
            .attr("fill", "steelblue")
            .attr("stroke", "white");

        // Круг за RSI (ќе се прикажува само ако е избран RSI)
        const rsiFocusCircle = focus.append("circle")
            .attr("class", "rsi-focus-circle")
            .attr("r", 5)
            .attr("fill", "purple")
            .attr("stroke", "white");

        // Overlay за фаќање на настани со глувчето
        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focus.style("display", null);
                if (tooltipRef.current) tooltipRef.current.style.opacity = 1;
            })
            .on("mouseout", () => {
                focus.style("display", "none");
                if (tooltipRef.current) tooltipRef.current.style.opacity = 0;
                setTooltipContent(null);
            })
            .on("mousemove", mousemove);

        function mousemove(event) {
            // Координати на глувчето во однос на SVG (со маргини)
            const [mx, my] = d3.pointer(event, svg.node());
            const x0 = xScale.invert(mx - margin.left);
            const i = d3.bisector(d => d.date).left(parsedData, x0, 1);

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

            // Проверка за валидност на податоците пред прикажување
            if (!d.date || isNaN(d.close) || isNaN(d.open) || isNaN(d.high) || isNaN(d.low) || isNaN(d.volume)) {
                setTooltipContent(null);
                focus.style("display", "none");
                return;
            }

            // Ажурирање на x-линијата
            focus.select(".x-hover-line")
                .attr("x1", xScale(d.date))
                .attr("x2", xScale(d.date));

            // Ажурирање на y-линијата и кругот за цена
            focus.select(".price-hover-line")
                .attr("y1", yScale(d.close))
                .attr("y2", yScale(d.close))
                .attr("x1", xScale(d.date))
                .attr("x2", 0);

            focus.select(".price-focus-circle")
                .attr("cx", xScale(d.date))
                .attr("cy", yScale(d.close));

            // Ажурирање на y-линијата и кругот за RSI (само ако има RSI и е избран)
            if (d.rsi !== undefined && indicator === 'RSI') {
                rsiFocusCircle
                    .attr("cx", xScale(d.date))
                    .attr("cy", rsiYScale(d.rsi)) // Користи rsiYScale за Y позицијата
                    .style("display", null);
            } else {
                rsiFocusCircle.style("display", "none");
            }

            // Ажурирање на tooltip со сите податоци
            setTooltipContent({
                date: d3.timeFormat("%Y-%m-%d")(d.date),
                open: d.open.toFixed(2),
                high: d.high.toFixed(2),
                low: d.low.toFixed(2),
                close: d.close.toFixed(2),
                volume: d.volume.toLocaleString(),
                rsi: d.rsi !== undefined ? d.rsi.toFixed(2) : 'N/A' // Додади RSI во tooltip
            });

            // Позиционирање на tooltip
            const tooltipWidth = tooltipRef.current ? tooltipRef.current.offsetWidth : 0;
            const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 0;
            let tooltipLeft = event.pageX + 10;
            let tooltipTop = event.pageY - 20;

            // Спречи tooltip да излезе надвор од десната страна
            if (tooltipLeft + tooltipWidth > window.innerWidth - 20) {
                tooltipLeft = event.pageX - tooltipWidth - 10;
            }
            // Спречи tooltip да излезе надвор од горната страна
            if (tooltipTop < 10) {
                tooltipTop = event.pageY + 20;
            }

            if (tooltipRef.current) {
                tooltipRef.current.style.left = `${tooltipLeft}px`;
                tooltipRef.current.style.top = `${tooltipTop}px`;
            }
        }

        // Заглавие на главниот график
        svg.append("text")
            .attr("x", (width + margin.left + margin.right) / 2 - margin.left) // Центар на главниот графикот
            .attr("y", 0 - (margin.top / 2) + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(`Дневна цена на затворање за ${symbol}`);

    }, [data, symbol, indicator]); // Додади indicator во dependency array за да се прецрта при промена

    return (
        <div>
            {data && data.length > 0 ? (
                <div style={{ position: 'relative' }}>
                    <svg ref={svgRef}></svg>
                    {tooltipContent && (
                        <div
                            ref={tooltipRef} // Прикачи ја референцата
                            className="stock-tooltip"
                            style={{
                                position: 'absolute',
                                // Овие се основни стилови, но позиционирањето ќе се ажурира во mousemove
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                pointerEvents: 'none',
                                zIndex: 100, // Повисок z-индекс за да е над другите елементи
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
                            {/* Прикажи RSI само ако има вредност */}
                            {tooltipContent.rsi !== 'N/A' && <p><strong>RSI:</strong> {tooltipContent.rsi}</p>}
                        </div>
                    )}
                </div>
            ) : (
                <p className="info-message">Внесете симбол и пребарајте за да видите график.</p>
            )}
        </div>
    );
};

export default StockChart;


