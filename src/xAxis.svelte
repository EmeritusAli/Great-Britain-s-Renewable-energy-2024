<script>
    import * as d3 from 'd3';

    export let xScale;
    export let height;
    export let margin;

    $: ticks = xScale ? xScale.ticks(d3.timeMonth.every(1)) : [];
    $: format = d3.timeFormat('%b');
</script>

<g transform="translate(0, {height - margin.bottom})">
    {#each ticks as tick}
        <line
            x1={xScale(tick)}
            x2={xScale(tick)}
            y1="0"
            y2="6"
            stroke="#556379"
        />
        <text
            x={xScale(tick)}
            y="20"
            text-anchor="middle"
            font-size="12"
            fill="white"
            opacity="0.6"
        >
            {format(tick)}
        </text>
    {/each}
    
</g>