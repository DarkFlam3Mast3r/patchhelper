from flask import Flask, request, jsonify
import os
from openai import OpenAI
import pandas as pd
import ast
from scipy import spatial
import tiktoken

#AI Part
client = OpenAI(
    # This is the default and can be omitted
    api_key="sk-GZK6522780241857854b343f3abd677899a1399f204cay4j",
    base_url="https://api.gptsapi.net/v1"
)
input_datapath="embedded_100_reviews.csv"
df = pd.read_csv(input_datapath,index_col=0)
df['ada_embedding'] = df['ada_embedding'].apply(ast.literal_eval)

def strings_ranked_by_relatedness(
    query: str,
    df: pd.DataFrame,
    relatedness_fn=lambda x, y: 1 - spatial.distance.cosine(x, y),
    top_n: int = 100
) -> tuple[list[str], list[float]]:
    """Returns a list of strings and relatednesses, sorted from most related to least."""
    query_embedding_response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=query,
    )
    query_embedding = query_embedding_response.data[0].embedding
    strings_and_relatednesses = [
        (row["combined"], relatedness_fn(query_embedding, row["ada_embedding"]))
        for i, row in df.iterrows()
    ]
    strings_and_relatednesses.sort(key=lambda x: x[1], reverse=True)
    strings, relatednesses = zip(*strings_and_relatednesses)
    return strings[:top_n], relatednesses[:top_n]
GPT_MODEL = "gpt-3.5-turbo"
def num_tokens(text: str, model: str = GPT_MODEL) -> int:
    """Return the number of tokens in a string."""
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))


def query_message(
    query: str,
    df: pd.DataFrame,
    model: str,
    token_budget: int
) -> str:
    """Return a message for GPT, with relevant source texts pulled from a dataframe."""
    strings, relatednesses = strings_ranked_by_relatedness(query, df)
    introduction = 'Use the below Reviews of Amazon to answer the subsequent question. If the answer cannot be found in the articles, write "I could not find an answer."'
    question = f"\n\nQuestion: {query}"
    message = introduction
    for string in strings:
        next_article = f'\n\nWikipedia article section:\n"""\n{string}\n"""'
        if (
            num_tokens(message + next_article + question, model=model)
            > token_budget
        ):
            break
        else:
            message += next_article
    return message + question


def ask(
    query: str,
    df: pd.DataFrame = df,
    model: str = GPT_MODEL,
    token_budget: int = 4096 - 500,
    print_message: bool = False,
) -> str:
    """Answers a query using GPT and a dataframe of relevant texts and embeddings."""
    message = query_message(query, df, model=model, token_budget=token_budget)
    if print_message:
        print(message)
    messages = [
        {"role": "system", "content": "You answer questions about the Amazon reviews."},
        {"role": "user", "content": message},
    ]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0
    )
    response_message = response.choices[0].message.content
    return response_message





#ServerPart
app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def handle_ask():
    data = request.get_json()
    print(f"Received request data: {data}") 
    question = data.get('question', '')

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Call ask function to get the answer
        #answer = ask(query=question)
        answer = "The most mentioned feature in the reviews is the taste/flavor of the products."
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(port=5000)
