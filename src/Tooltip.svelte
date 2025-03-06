<script >
     import { fly, fade } from "svelte/transition";
     export let hoveredData;
     export let colors;
</script>

<!-- {#if hoveredData && hoveredData.source}  
    <div
        class="tooltip"
        in:fly={{ y: 10, duration: 200, delay: 200 }}
        out:fade
        style="top: {hoveredData.y + 10}px; left: {hoveredData.x + 10}px;"
    >
       
        <h1>
            {hoveredData.date}
          </h1>
          <div class='info'>
          <span class="value">
            {#each hoveredData.values as {source, value}}
                <div class="tooltip-item">
                    <span class="source-color"
                    style="background: {colors[source]}; opacity: {source === 'Renewables (GW)' ? 1 : 0.5}"
                    ></span>
                    <span class="source-name">{source.replace(' (GW)', '')}</span>
                    <span class="value">{value} GW</span>
                </div>  
            {/each}
            {hoveredData.value} GW of
          </span>
          <span class="source" style="background: {colors[hoveredData.source]}">
            {hoveredData.source}
          </span> 
        </div>
    </div>
{/if} -->

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
    /* .tooltip {
    position: absolute;
    padding: 8px 10px;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
    border-radius: 3px;
    pointer-events: none;
    min-width: 130px;
    transition: top 300ms ease, left 300ms ease;
  }

  h1 {
        margin: 0 0 6px 0;
        font-size: 0.9rem;
        font-weight: 500;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
    }

  .info {
    display: flex;
    justify-content: column;
    gap: 6px;
  }

  .value {
    font-size: 0.8rem;
  }
  .tooltip-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .source-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
    }

    .source-name {
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: bold;
    } */
     
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