<script>
     import {data} from './stores';
     import * as d3 from 'd3';
     import Chart from './Chart.svelte';
     import XAxis from './xAxis.svelte';
     import YAxis from './yAxis.svelte';
     import Tooltip from './Tooltip.svelte';
     import Waffle from './Waffle.svelte';



     let xScale, yScale;
     let renewableEnergy, totalEnergy, renewablePercentage;
     let fossilEnergy, otherEnergy, transfersEnergy;
     // define colors
     let colors = {
        "Fossil Fuels (GW)": "#556379",
        "Renewables (GW)": "#00DD20",
        "Other Sources (GW)": "#556379",
        "Transfers (GW)": "#556379"

    }; 

    let hoveredData = null;

     

    $: console.log($data);


    $: groupedData = ['Renewables (GW)', 'Fossil Fuels (GW)', 'Other Sources (GW)', 'Transfers (GW)'].map(source => ({
        source,
        values: $data.filter(d => d.source === source).map(d => ({ date: d.date, value: d.value }))
    }));

    // Renewable energy percentage
    $: {
    if ($data && $data.length > 0) {
        // Group data by energy source
        const sourceGroups = d3.group($data, d => d.source);
        
        // Get total renewable energy (sum of all renewable values)
        const renewablesData = sourceGroups.get('Renewables (GW)') || [];
        const fossilData = sourceGroups.get('Fossil Fuels (GW)') || [];
        const otherData = sourceGroups.get('Other Sources (GW)') || [];
        const transfersData = sourceGroups.get('Transfers (GW)') || [];
        renewableEnergy = d3.sum(renewablesData, d => d.value);
        fossilEnergy = d3.sum(fossilData, d => d.value);
        otherEnergy = d3.sum(otherData, d => d.value);
        transfersEnergy = d3.sum(transfersData, d => d.value);

        
        // Get total energy (sum of all values)
        totalEnergy = d3.sum($data, d => d.value);
        
        // Calculate percentage
        renewablePercentage = totalEnergy > 0 ? (renewableEnergy / totalEnergy) * 100 : 0;
        
        console.log("Renewable energy total:", renewableEnergy);
        console.log("Total energy:", totalEnergy);
        console.log("Renewable percentage:", renewablePercentage);
    } else {
        renewableEnergy = 0;
        totalEnergy = 0;
        renewablePercentage = 0;
    }
};
    
     $: console.log(totalEnergy, renewableEnergy, renewablePercentage);

    const width = 660;
    const height = 320;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    // Reactive scales: update when $data changes
    $: {
        if ($data.length > 0) {
            xScale = d3.scaleTime()
                .domain(d3.extent($data, (d) => d.date))
                .range([margin.left, width - margin.right]);

            yScale = d3.scaleLinear()
                .domain([0, d3.max($data, (d) => d.value)]).nice()
                .range([height - margin.bottom, margin.top]);
        } else {
            xScale = null;
            yScale = null;
        }
    }

   
    function setHoveredData(event, hData) {
    if (hData && event) {
        const dateObject = hData.date instanceof Date 
            ? hData.date 
            : new Date(hData.date);

            const svgBounds = event.target.closest("svg").getBoundingClientRect();
            const tooltipWidth = 200;
            let tooltipX = event.clientX - svgBounds.left + 15;
            const tooltipY = event.clientY - svgBounds.top + 15;

            if (tooltipX + tooltipWidth > width){
                tooltipX -= tooltipWidth + 20;
            }

            if (tooltipX < 0){
                tooltipX = 10;
            }

        // Use the actual x-position of the guide line instead of clientX
        hoveredData = {
            x: tooltipX,
            y: tooltipY,
            date: d3.timeFormat("%B %d, %Y")(dateObject),
            values: hData.values
        };
        
        console.log("Tooltip data:", hoveredData);
    } else {
        hoveredData = null;
    }
};

</script>

<main class="dashboard">
    <div class="left-section">
        <div class="left-content">
            <p class='header-intro'>
                In 2024, Great Britain prioritized
            </p>
            <h1 class="description"> 
                <span class="highlight">Renewable</span>
                <span class="highlight eng">Energy</span>
            </h1>

            <p class="intro">In 2024, renewable energy overtook fossil fuels in Great Britain’s electricity generation, a key step toward net zero by 2050.</p>
            <div class="percentage-container">
                <div class="percentage-value"><span class="percent">{renewablePercentage.toFixed(1)}%</span> of energy generated in 2024 was from
                <span class="waffle-highlight">Renewable Energy</span></div>
                <div class="chart-box">
                    <Waffle 
                        {renewablePercentage} 
                        {renewableEnergy}
                        {fossilEnergy}
                        {otherEnergy} 
                        {transfersEnergy}
                        {totalEnergy}
                    />
                </div>
            </div>
        </div>
        <div class="footer-text">
            <p> <a href="https://makeovermonday.co.uk/">#MakeOverMonday</a></p>
            <p>Data source: <a href="https://grid.iamkate.com/">Elexon Insights Solution</a></p>
            <p>Design: <a href="https://www.linkedin.com/in/adekolaaliu/">Aliu Adekola</a></p>
        </div>
    </div>

  
   <div class="right-section">
       <p class="chart-title">How did Great Britain’s energy mix change in 2024?</p>
        <div class="line-chart">
            <svg width={width} height={height}>
                <Chart {groupedData} 
                    {xScale} 
                    {yScale} 
                    {colors}
                    {margin}
                    {width}
                    {height} 
                    onHover={setHoveredData}/>
                <XAxis {xScale} {height} {margin} />
                <YAxis {yScale} {margin} {width} />
            </svg>
          
            {#if hoveredData}
                <Tooltip {hoveredData} {colors} />
            {/if}
        </div>

   </div>           

</main>

<style>
    .dashboard {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 118px;
        background-color: #040C21; 
        padding: 77px 60px;
        max-height: 620px;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .left-section {
        flex: 1;
        max-width: 40%;
        color: white;
        height: 466px;
        display : flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .left-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
    }
    .header-intro {
        font-size: 11px;
        color: #ffffff;
        opacity: 0.6;
    }
    .description {
        margin-bottom: 15px;
        
    }
    .highlight {
        font-family: 'Electrolize', sans-serif;
        color: #ffffff;
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 1px;
        line-height: 0.9;
        display: block;
        opacity: 1;
        /* text-transform: uppercase; */
    }
 
    .eng {
        display: block;
    }
   
    .percentage-container {
        margin-top: 0;
        margin-bottom: auto;
        padding-top: 5px;
    }
    .intro{
        margin-top: auto;
        font-size: 0.9rem;
        margin-bottom: 15px;
        color: #ffffff;
        opacity: 0.6;
     
    }
    .percentage-value {
        font-size: 0.6rem;
        color: #c5c2c2;
        /* opacity: 0.6; */
    }

    .waffle-highlight {
        display: block;
        color: #00DD20;
        font-weight: bold;
        font-size: 0.9rem;
        opacity: 1;
    }
    .percent{
        font-size: 1.5rem;
        font-weight: bold;
        color: #ffffff;
        opacity: 1;
    }
   
    .chart-box {
        height: 200px;
        width: 200px;
        margin-top: auto;
        position: relative;
    }

    .footer-text {
        margin-top: auto;
        font-size: 0.8rem;
        color: #ffffff;
        opacity: 0.4;

    }
    a {
        color: #ffffff;
        text-decoration: none;
    }
    a:hover{
        color: chartreuse;
        font-weight: bold;
        opacity: 1;

    }

    /* Right Section */
    .right-section {
        flex: 1.5;
        height: 466px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .chart-title {
        padding-bottom: 20px;
        font-size: 1rem;
        color: white;
        opacity: 0.6;
    }
    .line-chart {
        position: relative;
        margin: 0 auto;
        background: #171F27;
        padding: 0px;
        height: 100%;
        width: 670px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;


    }
    :global(.tooltip) {
        position: absolute;
        z-index: 1000;
        pointer-events: none;
    }
    svg {
        font-family: 'Chakra Petch', sans-serif;
        font-size: 0.9rem;
        margin: 7px 0;
        padding-right: 20px;
        
    }
    main {
        /* text-align: center; */
        padding: 0;
        margin: 0 auto;
        font-family: 'Chakra Petch', sans-serif;
    }
    
    
</style>