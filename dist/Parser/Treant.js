let config = {
    container: "#tree-simple"
};
let parent_node = {
    text: { name: "Parent node" }
};
let first_child = {
    parent: parent_node,
    text: { name: "First child" }
};
let second_child = {
    parent: parent_node,
    text: { name: "Second child" }
};
let simple_chart_config = [
    config, parent_node,
    first_child, second_child
];
/*simple_chart_config = {
    chart: {
        container: "#tree-simple"
    },
    
    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            {
                text: { name: "First child" }
            },
            {
                text: { name: "Second child" }
            }
        ]
    }
};
/**/ 
//# sourceMappingURL=Treant.js.map