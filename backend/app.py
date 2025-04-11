from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows requests from your React frontend

mock_movies = {
    "results": [
        {
            "id": 1,
            "title": "The Great Pretender",
            "release_date": "2023-05-15",
            "overview": "A mysterious con artist charms the world.",
            "poster_path": "/pretender.jpg"
        },
        {
            "id": 2,
            "title": "Lunar Eclipse",
            "release_date": "2022-11-03",
            "overview": "A thriller set during a once-in-a-century eclipse.",
            "poster_path": "/eclipse.jpg"
        },
        {
            "id": 3,
            "title": "Neon Nights",
            "release_date": "2024-01-25",
            "overview": "A detective story set in a futuristic city.",
            "poster_path": "/neon.jpg"
        }
    ]
}

@app.route("/api/movies")
def get_mock_movies():
    return jsonify(mock_movies)

if __name__ == "__main__":
    app.run(debug=True)
