<script>
    import * as d3 from 'd3';

    export let xScale;
    export let height;
    export let margin;

     // Reactive ticks: only compute if xScale is defined
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
    {#if xScale}
        <!-- <line
            x1={margin.left}
            x2={xScale.range()[1]}
            y1="0"
            y2="0"
            stroke="black"
        /> -->
    {/if}
</g>