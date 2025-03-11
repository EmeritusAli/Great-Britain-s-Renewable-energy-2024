<script>

    export let yScale;
    export let margin;
    export let width;

    $: ticks = yScale ? yScale.ticks(10) : [];
</script>

<g transform="translate({margin.left}, 0)">
    {#each ticks as tick, index}
        <line
            class="gridLine"
            x1="0"
            x2={width - margin.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={index === 0 ? "" : '#556379'}
            stroke-opacity={0.5}
            stroke-dasharray="2"
        />
        {#if index === 0}
            <line
                class="xAxisLine"
                x1={0}
                x2={width - margin.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="#556379"
            />
        {/if}
        <line
            x1={-6}
            x2={0}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="#556379"
        />
        <text
            x="-10"
            y={yScale(tick)}
            dy="0.32em"
            text-anchor="end"
            font-size="11"
            fill="white"
            opacity="0.6"
        >
            {tick} GW
        </text>
    {/each}
    
</g>