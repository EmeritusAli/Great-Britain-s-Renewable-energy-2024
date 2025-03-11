<script>
    import * as d3 from 'd3';
    import WaffleTip from './WaffleTip.svelte';
    import { onMount } from 'svelte';
    export let renewablePercentage;
    export let totalEnergy;
    export let renewableEnergy;
    export let fossilEnergy;
    export let otherEnergy;
    export let transfersEnergy;


    const width = 200;
    const height = 200;

        
    let svgElement;
    let hoverd = false;
    let tooltipX = 0;
    let tooltipY = 0;

    function handleMouseOver(event) {
        hoverd = true;
        const rect = event.currentTarget.closest('.energy-chart').getBoundingClientRect();
        tooltipX = event.clientX - rect.left;
        tooltipY = event.clientY - rect.top;
    };

  function renderWaffle() {
        if (!svgElement) return;
        
        // Define grid dimensions
        const cellSize = Math.floor(Math.min(width / 12, height / 12));
        const numCols = Math.floor(width / cellSize);
        const numRows = Math.floor(height / cellSize);
        const totalCells = numCols * numRows;
        
        // Calculate cells for renewable energy
        const renewableCells = Math.round((renewablePercentage / 100) * totalCells);
        console.log("Renewable percentage:", renewablePercentage, "Cells:", renewableCells);
        
        // Create cells data
        const cells = Array.from({ length: totalCells }, (_, i) => ({
            index: i,
            renewable: i >= totalCells - renewableCells
        }));
        
        const svg = d3.select(svgElement);
        
        // Clear previous content
        svg.selectAll('*').remove();
        
        // Add rectangles for waffle chart
        svg.selectAll('rect')
            .data(cells)
            .enter()
            .append('rect')
            .attr('x', d => (d.index % numCols) * cellSize)
            .attr('y', d => Math.floor(d.index / numCols) * cellSize)
            .attr('width', cellSize - 2)
            .attr('height', cellSize - 2)
            .attr('fill', d => d.renewable ? '#4CAF50' : '#556379')
            .attr('opacity', d => d.renewable ? 1 : 0.5)
            .on('mouseover', handleMouseOver)
            .on('mousemove', handleMouseOver
            )
            .on('mouseout', () => {
                hoverd = false;
            });
    }

    onMount(() => {
        renderWaffle();
    });
    
    // re-render when props change
    $: if (renewablePercentage !== undefined && svgElement) {
        renderWaffle();
    };
</script>

<div class="energy-chart">
    <svg bind:this={svgElement} width={width} height={height}>
    </svg>
    {#if hoverd}
        <WaffleTip
        {renewableEnergy}
        {fossilEnergy}
        {otherEnergy} 
        {transfersEnergy}
        {totalEnergy} 
        {tooltipX}
        {tooltipY}
        />
    {/if}
</div>
   
  

<style>
    .energy-chart {
        display: block;
        margin: auto;
        position: relative;
        cursor: pointer;
    }
</style>
