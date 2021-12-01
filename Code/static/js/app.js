function init() {
    //using d3 read data and create drop down menu
    d3.json("samples.json").then((sampleData) => {
        
        let dropmenu = d3.select("#selDataset");
        let names = sampleData.names;
        names.forEach((name) => {
            dropmenu.append("option").text(name).property("value", name);
        });

        //functions to create initial plots 
        let sample1 = sampleData.names[0]
        createplots(sample1);
    })
};


function createplots(names) {
    d3.json("samples.json").then((sampleData) => {
        //metadata for demographic table
        let metadata = sampleData.metadata;
        let Table1 = d3.select("#sample-metadata");
        Table1.html("");

        //filter by each id
        let singleMetadata = metadata.filter(sample => sample.id == names)[0];

        //add the data to the table
        Object.entries(singleMetadata).forEach(([key, value]) => {
            Table1.append("h5").text(`${key}: ${value}`);
        });

        //variables for ploting
        let sampleInfo = sampleData.samples;
        let sampleResults = sampleInfo.filter(subject => subject.id == names)[0];
        let otu_labels = sampleResults.otu_labels;
        let otu_ids = sampleResults.otu_ids;
        let sample_values = sampleResults.sample_values;

        //bar chart
        let barIds = otu_ids.slice(0, 10).reverse();
        let barLabels = otu_labels.slice(0, 10).reverse();
        let barValues = sample_values.slice(0, 10).reverse();

        let Trace = [{
            x: barValues,
            y: barIds.map(id => `OTU ID ${id}`),
            text: barLabels,
            type: "bar",
            orientation: "h"
        }];

        let barLayout = {
            height: 500,
            widtgh: 500,
            title: `<b>Top 10 OTUs Found in Selected Subject</b>`
        }
        Plotly.newPlot("bar", Trace, barLayout);

        // bubble chart
        let bubble_Trace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Jet"
            }
        }];

        let bubbleLayout = {
            yaxis: {
                title: "<b>Sample Values</b>"
            },
            xaxis: {
                title: "<b>OTU ID</b>"
            }
        }

        Plotly.newPlot("bubble", bubble_Trace, bubbleLayout);
    })
};

//If a different ID/Sample is chosen from dropdown menu
function optionChanged(differentSample) {
    createplots(differentSample);
};



init();