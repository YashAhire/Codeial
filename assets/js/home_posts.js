{
    // method to submit the form data for new post using AJAX
    
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/post/create',
                data:newPostForm.serialize(),
                success:function(data){
                    // console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    new PostComments(data.data.post._id);
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error:function(err){
                    console.log(err.responseText);
                }
            })
        })
    }

    // method to create a post in DOM

    let newPostDom = function(post){                   
        return $(`<li id="post-${post._id}">
                    <p>
                        
                        <small>
                            <a class="delete-post-button" href="/post/destroy/${post._id}">X</a>
                        </small>
                        
                        <li>
                        ${ post.content }
                            <br>
                            ${ post.user.name }
                        </li>
                    </p>
                
                    <div class="post-comments">
                        
                            <form id="post-${ post._id }-comments-form" action="/comment/create" method="post">
                                <input type="text" name="content" placeholder="type here comment..." required>
                                <input type="hidden" name="post" value="${ post._id }">
                                <input type="submit" value="Add comment">
                            </form>
                        
                
                        <div class="post-comment-list">
                            <ul id="post-comment-${ post._id }">
                                
                            </ul>
                        </div>
                    </div>
                </li>`)
    }


    // method to delete a post from Dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error:function(err){
                    console.log(err.responseText);
                }
            })
        })
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and 
    //call the delete post method on delete link of each, also add AJAX (using the class we've created) 
    //to the delete button of each
    let convertPostsToAjax = function(){
        $('#post-list-container>ul>li').each(function(){ // p
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            //get the post's ID by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId); // p
        });
    }
    createPost();
    convertPostsToAjax(); // p
}