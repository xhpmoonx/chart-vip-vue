export function buildGraph(courses) {
    const graph = new Map();
    const inDegree = new Map();
  
    for (const course of courses) {
      graph.set(course.id, []);
      inDegree.set(course.id, 0);
    }
  
    for (const course of courses) {
      for (const prereq of course.prereqs || []) {
        graph.get(prereq).push(course.id);
        inDegree.set(course.id, inDegree.get(course.id) + 1);
      }
    }
  
    return { graph, inDegree };
  }
  /*
  export function findLongestPaths(courses) {
    const { graph, inDegree } = buildGraph(courses);
    const distances = new Map();
    const prev = new Map();
  
    for (const course of courses) {
      distances.set(course.id, 0);
    }
  
    const queue = [];
    for (const [node, degree] of inDegree.entries()) {
      if (degree === 0) queue.push(node); // source nodes
    }  
    while (queue.length > 0) {
      const u = queue.shift();
      for (const v of graph.get(u)) {
        if (distances.get(v) < distances.get(u) + 1) {
          distances.set(v, distances.get(u) + 1);
          prev.set(v, u);
        }
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }
  
    // Find the endpoint of the longest path
    let maxDist = -1, end = null;
    for (const [node, dist] of distances.entries()) {
      if (dist > maxDist) {
        maxDist = dist;
        end = node;
      }
    }
  
    // Reconstruct path
    const path = [];
    while (end != null) {
      path.unshift(end);
      end = prev.get(end);
    }
  
    return path;
  } */

  export function findLongestPathTo(courses, targetId) {
    const { graph, inDegree } = buildGraph(courses);
    const distances = new Map();
    const prev = new Map();
  
    for (const course of courses) {
      distances.set(course.id, 0);
    }
  
    const queue = [];
    for (const [node, degree] of inDegree.entries()) {
      if (degree === 0) queue.push(node); // source nodes
    }
  
    while (queue.length > 0) {
      const u = queue.shift();
      for (const v of graph.get(u)) {
        if (distances.get(v) < distances.get(u) + 1) {
          distances.set(v, distances.get(u) + 1);
          prev.set(v, u);
        }
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }
  
    // Reconstruct path to targetId
    const path = [];
    let current = targetId;
    while (current != null) {
      path.unshift(current);
      current = prev.get(current);
    }
  
    return path;
  }
  
    