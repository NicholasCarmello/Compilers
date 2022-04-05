class ScopeNode{

    name: string;
    parent: ScopeNode;
    children: ScopeNode[] = []
    scope  = new Map();
}