import random
from bson.objectid import ObjectId
from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('3.133.93.99', 27017, username="test", password="test")
db = client.netoon



@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        title_list = list(db.webtoon.find({},{'_id':False}))

        # 랭킹정하기
        raw_db = list(db.posts.find({}, {'title': 1, 'comment': 1, 'img_url': 1}))
        print(raw_db)

        # 순위랑 title 리스트
        list_toon = []  # title만 따로 넣을 리스트 만들기
        for i in range(len(raw_db)):
            a = raw_db[i]['title']
            list_toon.append(a)

        print(list_toon)
        count = {}
        for j in list_toon:
            try:
                count[j] += 1
            except:
                count[j] = 1

        # count = {'웹툰파일이름[0]': 포스팅한수, '웹툰파일이름[0]': 1, 'apple': 1}
        # value값에 맞게 내림차순으로 정렬
        new_count = sorted(count.items(), reverse=True, key=lambda item: item[1])
        print(new_count)
        give_information = []
        for i in new_count:
            give_information.append(list(i))

        print(give_information)
        top10_list = []
        for i in give_information:
            top10_list.append(i[0])
            print(i[0], i[1])

        comment_dict = {}
        for title in top10_list:
            comments = []
            for item in raw_db:
                if item['title'] == title:
                    comments.append(item['comment'])
                comment_dict[title] = comments

        for i in give_information:
            var1 = comment_dict[i[0]]
            rand_comment = var1[random.randint(0, len(var1) - 1)]
            i.append(rand_comment)

        img_dict = {}
        for title in top10_list:
            for item in raw_db:
                if item['title'] == title:
                    img_dict[title] = item['img_url']

        for i in give_information:
            img_url = img_dict[i[0]]
            i.append(img_url)

        return render_template('index.html', user_info=user_info, title_list=title_list, rank=give_information[:9])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))


@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
            'id': username_receive,
            'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
            # 'exp': datetime.utcnow() + timedelta(seconds=5)  # 로그인 5초 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})


@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,  # 아이디
        "password": password_hash,  # 비밀번호
        "profile_name": username_receive,  # 프로필 이름 기본값은 아이디
        "profile_pic": "",  # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png",  # 프로필 사진 기본 이미지
        "profile_info": ""  # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    # print(value_receive, type_receive, exists)
    return jsonify({'result': 'success', 'exists': exists})



@app.route('/posting', methods=['POST'])
def posting():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        title_receive = request.form["title_give"]
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]

        toon_img = db.webtoon.find_one({"title": title_receive})

        doc = {
            "username": user_info["username"],
            "profile_name": user_info["profile_name"],
            "profile_pic_real": user_info["profile_pic_real"],
            "title": title_receive,
            "comment": comment_receive,
            "img_url": toon_img['img'],
            "date": date_receive
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", 'msg': '포스팅 성공'})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/get_posts", methods=['GET'])
def get_posts():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        posts = list(db.posts.find({}).sort("date", -1).limit(20))
        for post in posts:
            post["_id"] = str(post["_id"])
            post["count_heart"] = db.likes.count_documents({"post_id": post["_id"], "type": "heart"})
            post["heart_by_me"] = bool(db.likes.find_one({"post_id": post["_id"], "type": "heart", "username": payload['id']}))
        return jsonify({"result": "success", "msg": "포스팅을 가져왔습니다.", "posts":posts})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route('/update_like', methods=['POST'])
def update_like():
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.users.find_one({"username": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "post_id": post_id_receive,
            "username": user_info["username"],
            "type": type_receive
        }
        if action_receive == "like":
            db.likes.insert_one(doc)
        else:
            db.likes.delete_one(doc)
        count = db.likes.count_documents({"post_id": post_id_receive, "type": type_receive})
        return jsonify({"result": "success", 'msg': 'updated', "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))



@app.route('/delete_post', methods=['POST'])
def delete_post():
    _id = request.form['id_give']
    db.posts.delete_one({'_id': ObjectId(_id)})

    return jsonify({'result': 'success'})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
