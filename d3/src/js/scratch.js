     console.log(conversation);
      function most_overindexed(fips) {
        var top_score=0;
        var top_topic;
        // fips = fips.toString();
        if (!conversation.geographies[fips]) {
            console.log(fips)
            return "NoData";
        }
        for (var i=0;i<conversation.topics.length;i++) {
            var score = conversation.geographies[fips].ts[i]/conversation.geographies[0].ts[i];
            if (score>top_score) {
                top_score = score;
                top_topic = conversation.topics[i];
            }
        }
        return top_topic;
      }

      function topic_class(topic) {
        return 'topic-'+topic.replace(/\W/g,'');
      }
      var winner_count = {'NoData':0};
      conversation.topics.forEach(function(t) {
        winner_count[t] = 0;
      })


      var sorted_topics = conversation.topics.map(function(d){return d});
      sorted_topics.sort(function(a,b) {return winner_count[b]-winner_count[a];});

      var legend = d3.select("body").append("div");
      legend.selectAll("div")
        .data(sorted_topics)
        .enter().append("div")
        .text(function(d){return d + winner_count[d];})
        .attr('class',topic_class)