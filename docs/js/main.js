(function(){

    var projection = d3.geoAlbersUsa();

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(".container").append("svg")
        .attr("width", "100%")
        .attr("viewBox", "0 0 960 500");

    var dispatch = d3.dispatch("topicchange");

    d3.queue()
        .defer(d3.json,"data/us.json")
        .defer(d3.json,"data/conversation.json")
        .await(init);

    function init(error, topology,conversation) {
      if (error) throw error;

      var topicselect = d3.select(".container")
        .append("select")
        .on("change", function() { dispatch.call('topicchange',{},this.value); });

      topicselect.selectAll("option")
      .data(conversation.topics)
      .enter().append("option")
      .attr("value", function(d,i) { return i; })
      .text(function(d) { return d; });

      var counties = svg.selectAll("path")
        .data(topojson.feature(topology, topology.objects.counties).features)
        .enter().append("path")
        .style("fill","#ccc")
        .attr("d", path);

      function maxish(vals,pct) {
        vals.sort(function(a,b) {return a-b;});
        return vals[Math.floor(vals.length*pct)];
      }

      function render(topic_i) {

        var scale = d3.scaleLinear()
                        .domain([0,maxish(d3.values(conversation.geographies).map(function(d) {
                            return d.ts[topic_i];
                        }),0.99)]);
        console.log(scale.domain())
        counties.transition()
         .style("fill",function(d) {
            if (!conversation.geographies[d.id]) return "#ccc";
            var val = scale(conversation.geographies[d.id].ts[topic_i]);
            return d3.interpolateMagma(val);
         })
      }

      dispatch.on("topicchange.counties", render);

      render(0);

    };
})();