import {readable} from 'svelte/store';
import { csv, autoType, timeParse} from 'd3';

const dataPath = 'src/lib/data/UKEnergySource_data.csv';
export const data = readable([], (set) => {
    (async () => {
        const loadedData = await csv(dataPath, (d) => {
            const parsedDate = timeParse('%d/%m/%Y')(d.Date);
            if (parsedDate.getFullYear() !== 2025) {
                return {
                    ...d,
                    date: parsedDate,
                    demand: +d['Demand (GW)'],
                    source: d["Energy Source"],
                    value: +d['Value (GW)']
                };
            }
        });
        set(loadedData);
    })();
});