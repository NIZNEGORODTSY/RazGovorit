import kagglehub

# Download latest version
path = kagglehub.dataset_download("athugodage/russian-legal-text-parallel-corpus")

print("Path to dataset files:", path)