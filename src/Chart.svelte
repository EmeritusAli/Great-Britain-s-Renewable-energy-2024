<script>
    import * as d3 from 'd3';

    export let groupedData;
    export let xScale;
    export let yScale;
    export let colors;
    export let margin;
    export let width;
    export let height;
    export let onHover = (event, data) => {};
    let hoveredX = null;

    $: line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    function handleMouseMove(event) {
        console.log('Mouse move event triggered');
        const svgElement = event.target.closest('svg');
        const point = d3.pointer(event, svgElement);
        const mouseX = point[0];
        
        if (!xScale || !yScale) {
            console.log('Missing scales');
            return;
        }

        // Fix 1: Create bisector that works directly with dates
        const bisectDate = d3.bisector(d => d).left;
        
        if (!groupedData || !groupedData[0] || !groupedData[0].values || groupedData[0].values.length === 0) {
            console.log('No grouped data available');
            return;
        }
        
        const allDates = groupedData[0].values.map(d => d.date);
        const date = xScale.invert(mouseX);
        
        // Fix 2: Debug date conversion
        console.log('Mouse position:', mouseX);
        console.log('Inverted date:', date);
        console.log('All dates:', allDates);
        
        // Fix 3: Sort dates to ensure bisector works correctly
        const sortedDates = [...allDates].sort((a, b) => a - b);
        const index = bisectDate(sortedDates, date);
        console.log('Bisect index with sorted dates:', index);
        
        // Don't return early for index === 0
        
        // Handle edge cases properly
        let d0, d1;
        if (index === 0) {
            // At the start of data, just use first point
            d0 = sortedDates[0]; 
            d1 = index < sortedDates.length ? sortedDates[index] : null;
        } else if (index >= sortedDates.length) {
            // At the end of data, use last point
            d0 = sortedDates[sortedDates.length - 1];
            d1 = null;
        } else {
            // Normal case - we're between two points
            d0 = sortedDates[index - 1];
            d1 = sortedDates[index];
        }
        
        console.log('Found dates:', d0, d1);
        
        // Fix 4: Better date comparison using timestamps
        const closestDate = d1 && d0 
            ? (Math.abs(date - d0) < Math.abs(date - d1) ? d0 : d1) 
            : d0;
            
        console.log('Closest date:', closestDate);

        if (closestDate) {
            hoveredX = xScale(closestDate);
            console.log('hoveredX set to:', hoveredX);
            
            const valuesAtDate = groupedData.map(({ source, values }) => {
                // Fix 5: Compare using timestamps to avoid timezone issues
                const point = values.find(d => 
                    d.date.getTime() === closestDate.getTime()
                );
                return point ? { ...point, source } : null;
            }).filter(Boolean);
            
            console.log('Values at date:', valuesAtDate);

           

    if (valuesAtDate.length > 0) {
        const svgBounds = event.target.closest('svg').getBoundingClientRect();
        const tooltipWidth = 150;  // Adjust based on actual tooltip size
        let tooltipX = event.clientX - svgBounds.left + 15;
        const svgRightEdge = svgBounds.right - svgBounds.left;


        if (tooltipX + tooltipWidth > svgRightEdge) {
    tooltipX = svgRightEdge - tooltipWidth - 10; // Ensure it stays inside chart
        } else if (tooltipX < 0) {
            tooltipX = 10; // Prevent it from going too far left
        }
        console.log("Client X:", event.clientX);
        console.log("SVG Bounds Left:", svgBounds.left);
        console.log("Tooltip X Before Adjusting:", event.clientX - svgBounds.left + 15);
        console.log("Tooltip X After Adjusting:", tooltipX);

        onHover(event, {
            date: closestDate,
            x: tooltipX,
            y: event.clientY - svgBounds.top,
            values: valuesAtDate
        });
   
            
            }
        }
};
        
    function handleMouseOut() {
        hoveredX = null;
        onHover(null, null);
    };
</script>

<g class="chart-content">
     <!-- Overlay must cover the entire chart area -->
     <rect
            x={margin.left}
            y={margin.top}
            width={width - margin.left - margin.right}
            height={height - margin.top - margin.bottom}
            fill="transparent" 
            class="overlay"
            on:mousemove={handleMouseMove} 
            on:mouseout={handleMouseOut}
            on:mouseleave={handleMouseOut}
 />
    <!-- Draw lines first -->
    {#each groupedData as { source, values }, i}
        {#if xScale && yScale && values.length > 0}
            <path
                d={line(values)}
                class="line"
                fill="none"
                stroke={colors[source]}
                stroke-width="2"
                opacity={source === 'Renewables (GW)' ? 1 : 0.5}
            />
        {/if}
    {/each}
    <!-- Guide elements on top -->
    {#if hoveredX !== null}
        <line
            class="guide-line"
            x1={hoveredX}
            x2={hoveredX}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke="#556379"
            stroke-dasharray="3 3"
            opacity="0.8"
        />

        {#each groupedData as { source, values }}
            {#if xScale && yScale && values.length > 0}
                {#each values as d}
                    {#if Math.abs(xScale(d.date) - hoveredX) < 1}
                        <circle
                            cx={xScale(d.date)}
                            cy={yScale(d.value)}
                            r="2"
                            fill={colors[source]}
                            stroke="#556379"
                            stroke-width="0.5"
                        />
                    {/if}
                {/each}
            {/if}
        {/each}
    {/if}
</g>

<style>
    .overlay {
        fill: transparent;
        pointer-events: all;
        cursor: crosshair;
    }

    .line {
        pointer-events: none;
    }

    .guide-line {
        pointer-events: none;
    }

    circle {
        pointer-events: none;
    }
</style>