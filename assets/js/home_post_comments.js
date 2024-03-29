class PostComments{
    constructor(postId){
        this.postId = postId;
        this.postContailner = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        this.createComment(postId);

        let self = this;
        //call for all th existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }

    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type:'post',
                url:'/comments/create',
                data:$(self).serialize(),
                success:function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comment-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published",
                        type:'success',
                        layout:'topRight',
                        timeout:1500
                    }).show();
                },error:function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${comment._id}">
                    <p>
                        <% if (locals.user && locals.user.id == comment.user.id) { %> 
                            <small>
                                <a class="delete-comment-button" href="/comment/destroy/${comment._id}">X</a>
                            </small>
                        <% } %>
                
                        ${comment.content}
                    </p>
                    <br>
                    <small>
                    ${comment.user.name}
                    </small>
                </li>`);

    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Comment deleted",
                        type:'success',
                        layout:'topRight',
                        timeout:1500
                    }).show();
                },error:function(err){
                    console.log(err.responseText);
                }
            });
        });
    }

}