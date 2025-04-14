import re
import pandas as pd
import pickle
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from nltk.corpus import stopwords

# Download stopwords jika belum ada
nltk.download("stopwords")

# Stopwords bahasa Indonesia
stop_words_indonesian = stopwords.words("indonesian")

# Inisialisasi stemmer bahasa Indonesia dari Sastrawi
factory = StemmerFactory()
stemmer = factory.create_stemmer()

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\d+", "", text)
    words = text.split()
    words = [stemmer.stem(word) for word in words if word not in stop_words_indonesian]
    return " ".join(words)

# Load dataset
file_path = "app/models/ml/data_training.xlsx"
df = pd.read_excel(file_path)

# Preprocessing dataset
df["Narasi_Clean"] = df["Narasi"].apply(preprocess_text)

# TF-IDF
tfidf = TfidfVectorizer()
X = tfidf.fit_transform(df["Narasi_Clean"])
y = df["Jurusan"]

# KNN Model
knn = KNeighborsClassifier(n_neighbors=10)
knn.fit(X, y)

# Save model and vectorizer
with open("app/models/ml/model.pkl", "wb") as model_file:
    pickle.dump(knn, model_file)

with open("app/models/ml/tfidf.pkl", "wb") as tfidf_file:
    pickle.dump(tfidf, tfidf_file)

def predict_jurusan(input_text):
    input_clean = preprocess_text(input_text)

    # Load model
    with open("app/models/ml/model.pkl", "rb") as model_file:
        knn = pickle.load(model_file)

    with open("app/models/ml/tfidf.pkl", "rb") as tfidf_file:
        tfidf = pickle.load(tfidf_file)

    input_vector = tfidf.transform([input_clean])
    predicted_jurusan = knn.predict(input_vector)[0]

    probabilities = knn.predict_proba(input_vector)
    jurusan_prob = dict(zip(knn.classes_, probabilities[0]))
    sorted_jurusan_prob = sorted(jurusan_prob.items(), key=lambda x: x[1], reverse=True)

    return sorted_jurusan_prob[0][0], sorted_jurusan_prob[0][1] * 100
