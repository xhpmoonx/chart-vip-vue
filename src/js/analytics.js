// analytics.js

export function buildGraph(courses) {
    const graph = {};
    courses.forEach(course => {
      graph[course.id] = {
        ...course,
        incoming: [],
        outgoing: []
      };
    });
    courses.forEach(course => {
      course.prereqs.forEach(prereqId => {
        graph[prereqId]?.outgoing.push(course.id);
        graph[course.id]?.incoming.push(prereqId);
      });
    });
    return graph;
  }
  
  export function computeDelay(graph) {
    const delays = {};
  
    function dfs(id) {
      if (delays[id] !== undefined) return delays[id];
      const prereqs = graph[id].incoming;
      if (!prereqs || prereqs.length === 0) return (delays[id] = 0);
      delays[id] = Math.max(...prereqs.map(dfs)) + 1;
      return delays[id];
    }
  
    Object.keys(graph).forEach(id => dfs(id));
    return delays;
  }
  
  export function computeBlocking(graph) {
    const blocking = {};
  
    function dfs(id, visited) {
      if (visited.has(id)) return;
      visited.add(id);
      graph[id].outgoing.forEach(child => dfs(child, visited));
    }
  
    for (const id in graph) {
      const visited = new Set();
      dfs(id, visited);
      visited.delete(id); // remove self
      blocking[id] = visited.size;
    }
  
    return blocking;
  }
  
  export function attachMetrics(courses) {
    const graph = buildGraph(courses);
    const delays = computeDelay(graph);
    const blocking = computeBlocking(graph);
  
    return courses.map(course => ({
      ...course,
      metrics: {
        delay: delays[course.id],
        blocking: blocking[course.id],
        complexity: delays[course.id] + blocking[course.id]
      }
    }));
  }
  