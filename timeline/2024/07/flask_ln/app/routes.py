from flask import jsonify, request
from flask_restful import Resource
from .models import Article
from . import db

class Nahida(Resource):
    def get(self):
        """
        A simple GET endpoint
        ---
        responses:
          200:
            description: A successful response
            schema:
              type: object
              properties:
                author:
                  type: string
                  example: "Nahida"
        """
        return jsonify({"author": "Nahida"})

class ArticleResource(Resource):
    def get(self):
        """
        Get all articles
        ---
        responses:
          200:
            description: A list of articles
            schema:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  title:
                    type: string
                  content:
                    type: string
        """
        articles = Article.query.all()
        return jsonify([{"id": article.id, "title": article.title, "content": article.content} for article in articles])

    def post(self):
        """
        Create a new article
        ---
        parameters:
          - in: body
            name: body
            schema:
              type: object
              properties:
                title:
                  type: string
                content:
                  type: string
        responses:
          201:
            description: Article created
        """
        data = request.get_json()
        new_article = Article(title=data['title'], content=data['content'])
        db.session.add(new_article)
        db.session.commit()
        return jsonify({"message": "Article created"}), 201