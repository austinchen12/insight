import hdbscan
import numpy as np


def get_clusters(embeddings):
  clusterer = hdbscan.HDBSCAN()
  print("clusterer", clusterer)
  clusterer.fit(embeddings)
  cluster_labels = clusterer.labels_

  print("cluster labels", cluster_labels)

  num_clusters = cluster_labels.max() + 1
  print(f"Number of clusters: {num_clusters}")

def generate_cluster(center, num_points, deviation=0.1):
    return np.random.normal(loc=center, scale=deviation, size=(num_points, len(center)))

def main():
  cluster1_center = np.array([0.5, 0.5])
  cluster2_center = np.array([-0.5, -0.5])
  cluster1_vectors = generate_cluster(cluster1_center, 50, deviation=0.05)
  cluster2_vectors = generate_cluster(cluster2_center, 50, deviation=0.05)
  embedding_vectors = np.vstack([cluster1_vectors, cluster2_vectors])
  get_clusters(embedding_vectors)



if __name__ == "__main__":
  main()