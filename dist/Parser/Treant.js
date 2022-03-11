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
//# sourceMappingURL=Treant.js.map