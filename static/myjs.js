function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

function get_posts(username) {
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)

                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let class_star = post['star_by_me'] ? "fa-star" : "fa-star-o"
                    let class_like = post['like_by_me'] ? "fa-thumbs-up" : "fa-thumbs-o-up"

                    let html_temp = `<div class="post" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['username']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_heart"])}</span>
                                                        </a>
                                                        <a class="level-item is-sparta" aria-label="star" onclick="toggle_like('${post['_id']}', 'star')">
                                                            <span class="icon is-small"><i class="fa ${class_star}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_star"])}</span>
                                                        </a>
                                                        <a class="level-item is-sparta" aria-label="like" onclick="toggle_like('${post['_id']}', 'like')">
                                                            <span class="icon is-small"><i class="fa ${class_like}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(post["count_like"])}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='${type}']`)
    let $i_like = $a_like.find("i")
    let class_s = {"heart": "fa-heart", "star": "fa-star", "like": "fa-thumbs-up"}
    let class_o = {"heart": "fa-heart-o", "star": "fa-star-o", "like": "fa-thumbs-o-up"}
    if ($i_like.hasClass(class_s[type])) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass(class_o[type]).removeClass(class_s[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass(class_s[type]).removeClass(class_o[type])
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}


function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(response["count"])
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(response["count"])
            }
        })

    }
}

//코멘트 등록
function post() {
    let title = $('#selectarea-post').val()
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            title_give: title,
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}


// 코멘트 보여주기
function get_posts() {
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: "/get_posts",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let count_heart = post['count_heart']
                    let html_temp = `<div class="cardpost " id="${post["_id"]}" name="test_name">
                                        <article class="media">
                                            <div class="media-left">
                                                <p class="image is-64x64"">
                                                    <img class="is-rounded" src="${post['img_url']}"
                                                         alt="Image">
                                                </p>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p id="user_name">
                                                        <strong>${post['title']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br id='post_comment'>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small">
                                                                <i class="fa ${class_heart}" aria-hidden="true"></i>
                                                            </span>&nbsp;<span class="like-num">${count_heart}</span>
                                                        </a>
                                                    </div>
                                                    <div>
<!--                                                        <button type="button" class="btn btn-primary" data-toggle="modal"-->
<!--                                                                data-target="#exampleModal"-->
<!--                                                                data-whatever="@mdo">수정-->
<!--                                                        </button>-->
<!--                                                        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog"-->
<!--                                                             aria-labelledby="exampleModalLabel" aria-hidden="true">-->
<!--                                                            <div class="modal-dialog" role="document">-->
<!--                                                                <div class="modal-content">-->
<!--                                                                    <div class="modal-header">-->
<!--                                                                        <h5 class="modal-title" id="exampleModalLabel">수정하기</h5>-->
<!--                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--                                                                            <span aria-hidden="true">&times;</span>-->
<!--                                                                        </button>-->
<!--                                                                    </div>-->
<!--                                                                    <div class="field">-->
<!--                                                                        <p class="select is-rounded">-->
<!--                                                                            <select id="modify-selectarea-post">-->
<!--                                                                                {% for title in title_list %}-->
<!--                                                                                    <option>{{ title['title'] }}</option>-->
<!--                                                                                {% endfor %}-->
<!--                                                                            </select>-->
<!--                                                                        </p>-->
<!--                                                                        <p class="control">-->
<!--                                                                            <textarea id="modify-textarea-post" class="textarea"-->
<!--                                                                                      placeholder="웹툰에 대해 작성해주세요."></textarea>-->
<!--                                                                        </p>-->
<!--                                                                    </div>-->
<!--                                                                    <div class="modal-footer">-->
<!--                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">취소-->
<!--                                                                        </button>-->
<!--                                                                        <button type="button" class="btn btn-primary" onclick="update_post()">수정하기</button>-->
<!--                                                                    </div>-->
<!--                                                                </div>-->
<!--                                                            </div>-->
<!--                                                        </div>-->
                                                        <button type="button" class="btn btn-primary" data-toggle="modal"
                                                                data-target="#exampleModalCenter">
                                                            삭제
                                                        </button>
                                                        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
                                                             aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                            <div class="modal-dialog modal-dialog-centered" role="document">
                                                                <div class="modal-content">
                                                                    <div class="modal-header">
                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal-body">
                                                                        정말로 삭제하시겠습니까?
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">취소
                                                                        </button>
                                                                        <button type="button" class="btn btn-primary" onclick="delete_post()">삭제하기</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}


$(document).ready(function () {
    get_posts()
})


function delete_post() {
    let var1 = document.getElementsByClassName('cardpost')
    let id = var1[1]['id']
    console.log(id)
    $.ajax({
        type: "POST",
        url: "/delete_post",
        data: {id_give: id},
        success: function (response) {
            if (response["result"] == "success") {
                alert(response['result'])
            }
            window.location.reload()
        }
    })
}

function sign_out() {
    $.removeCookie('mytoken', {path: '/'});
    alert('로그아웃')
    window.location.href = '/login'
}
