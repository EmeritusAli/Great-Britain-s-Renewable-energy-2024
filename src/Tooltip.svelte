<script >
     import { fly, fade } from "svelte/transition";
     export let hoveredData;
     export let colors;
</script>


{#if hoveredData}
<div
      class="tooltip"
      style="
        left: {Math.min(hoveredData.x + 15, window.innerWidth - 220)}px;
        top: {hoveredData.y - 10}px;
        transform: translateX(
        {hoveredData.x + 220 > window.innerWidth ? '-100%' : '0'}
      );
      "
      >
        <h3>{hoveredData.date}</h3>
        <div class="tooltip-content">
            {#each hoveredData.values as item}
                <div class="tooltip-row">
                    <span 
                        class="color-dot"
                        style="background-color: {colors[item.source]}"
                    ></span>
                    <span class="source">{item.source.replace(' (GW)', '')}</span>
                    <span class="value">{item.value.toFixed(1)} GW</span>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
   
     
    .tooltip {
      position: absolute;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        pointer-events: none;
        z-index: 1000;
        font-size: 14px;
    }

    h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
    }

    .tooltip-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .tooltip-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .color-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
    }

    .source {
        flex: 1;
    }

    .value {
        font-weight: 500;
    }

 
</style>