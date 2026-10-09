package com.google.ar.core.examples.kotlin.helloar.navigation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class PathfinderTest {

  @Test
  fun testDirectPathFound() {
    val graph = NavigationGraph()
      .withEdge("entrance", "hallway", 5f)
      .withEdge("hallway", "room101", 3f)

    val result = Pathfinder.findPath(graph, "entrance", "room101")
    assertNotNull(result)
    assertEquals(listOf("entrance", "hallway", "room101"), result?.waypointIds)
    assertEquals(8f, result?.totalCost ?: 0f, 0.001f)
  }

  @Test
  fun testShortestPathChosenOverLongerPath() {
    // Two alternative routes:
    // Route 1: A -> B -> D (cost 2 + 2 = 4)
    // Route 2: A -> C -> D (cost 10 + 1 = 11)
    val graph = NavigationGraph()
      .withEdge("A", "B", 2f)
      .withEdge("B", "D", 2f)
      .withEdge("A", "C", 10f)
      .withEdge("C", "D", 1f)

    val result = Pathfinder.findPath(graph, "A", "D")
    assertNotNull(result)
    assertEquals(listOf("A", "B", "D"), result?.waypointIds)
    assertEquals(4f, result?.totalCost ?: 0f, 0.001f)
  }

  @Test
  fun testStartEqualsGoal() {
    val graph = NavigationGraph().withEdge("A", "B", 2f)
    val result = Pathfinder.findPath(graph, "A", "A")
    assertNotNull(result)
    assertEquals(listOf("A"), result?.waypointIds)
    assertEquals(0f, result?.totalCost ?: -1f, 0.001f)
  }

  @Test
  fun testUnreachableGoalReturnsNull() {
    val graph = NavigationGraph()
      .withEdge("A", "B", 2f)
      .withEdge("C", "D", 3f)

    val result = Pathfinder.findPath(graph, "A", "D")
    assertNull(result)
  }

  @Test
  fun testEmptyGraphReturnsNullForDifferentNodes() {
    val graph = NavigationGraph()
    val result = Pathfinder.findPath(graph, "A", "B")
    assertNull(result)
  }

  @Test
  fun testGraphEdgeManipulation() {
    var graph = NavigationGraph()
    graph = graph.withEdge("A", "B", 4f)
    assertTrue(graph.hasEdge("A", "B"))
    assertTrue(graph.hasEdge("B", "A"))
    assertEquals(1, graph.edges.size)

    // Adding duplicate edge should not duplicate
    graph = graph.withEdge("B", "A", 4f)
    assertEquals(1, graph.edges.size)

    // Removing edge
    graph = graph.withoutEdge("A", "B")
    assertEquals(0, graph.edges.size)

    // Removing waypoint
    graph = graph.withEdge("A", "B", 1f).withEdge("B", "C", 1f)
    graph = graph.withoutWaypoint("B")
    assertEquals(0, graph.edges.size)
  }
}
