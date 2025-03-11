<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';

    export let totalEnergy;
    export let renewableEnergy;
    export let fossilEnergy;
    export let otherEnergy;
    export let transfersEnergy;
    export let tooltipX;
    export let tooltipY;
 
   
    
    let svgElement;
    
    const width = 180;
    const height = 100;
    const barHeight = 15;
    const margin = { left: 80, top: 10, bottom: 20, right: 10 };
    
    // Energy Data
    let energyData = [
        { name: "Renewable", value: renewableEnergy, color: "#4CAF50" },
        { name: "Fossil Fuels", value: fossilEnergy, color: "#FF5733" },
        { name: "Other", value: otherEnergy, color: "#556379" },
        { name: "Transfers", value: transfersEnergy, color: "#FFC107" }
    ];

    onMount(() => {
  
        const xScale = d3.scaleLinear()
            .domain([0, totalEnergy])
            .range([0, width - margin.left - margin.right]);

 
        const svg = d3.select(svgElement)
            .attr("width", width)
            .attr("height", height);

        // Create Bars
        svg.selectAll("rect")
            .data(energyData)
            .enter()
            .append("rect")
            .attr("x", margin.left)
            .attr("y", (d, i) => margin.top + i * (barHeight + 5))
            .attr("width", d => xScale(d.value))
            .attr("height", barHeight)
            .attr("fill", d => d.color);

        // Add Labels
        svg.selectAll("text")
            .data(energyData)
            .enter()
            .append("text")
            .attr("x", 5)
            .attr("y", (d, i) => margin.top + i * (barHeight + 5) + barHeight / 1.5)
            .text(d => `${d.name}`)
            .attr("font-size", "12px")
            .attr("fill", "black");

        // Values
        svg.selectAll("text.value")
            .data(energyData)
            .enter()
            .append("text")
            .attr("x", d => margin.left + xScale(d.value) + 5)
            .attr("y", (d, i) => margin.top + i * (barHeight + 5) + barHeight / 1.5)
            .text(d => `${d.value.toFixed(1)} GW`)
            .attr("font-size", "12px")
            .attr("fill", "black");
    });
</script>

<div class="tip" style="left: {tooltipX + 10}px; top: {tooltipY - 10}px;
    transform: translate(0, -100%);">
    <div class="tooltip-header">Total Energy: <strong>{totalEnergy.toFixed(1)} GW</strong></div>
    <svg bind:this={svgElement}></svg>
</div>

<style>
    .tip {
        position: absolute;
        background: rgba(255, 255, 255, 1.0);
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        width: 200px;
    }
    .tooltip-header {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        text-align: center;
        color: black;
    }
</style>