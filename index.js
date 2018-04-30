'use strict';

const fs = require('hexo-fs');
const path = require('path');

// copy style file into public folder
const baseDir = hexo.base_dir;
const styleFile = 'tag-chat.css';
const styleUri = path.resolve(__dirname, styleFile);
fs.copyFile(styleUri, path.resolve(baseDir, hexo.config.public_dir, 'css', styleFile));

// insert the style file before the post content
hexo.extend.filter.register('before_post_render', function(data) {
  if ((/{%\s*chat/).test(data.content)) {
    const styleLink = `{% raw %}<link rel="stylesheet" href="${hexo.config.root}css/${styleFile}" />{% endraw %}`;
    const jsLink = '';
    console.log(styleLink);
    data.content = styleLink + data.content;
    return data;
  }
});


hexo.extend.tag.register('chat', function(args, content){
        var config = [];
        config.showAuthor = false;
        config.showAvatar = true;   

        var returnHTML = "";

        // argument
        var chatList = [];
        for (var i in args) {
            var arg = args[i].trim();
            if(arg.endsWith(':')) {
               chatList.push({author: arg.slice(0, -1).trim()});
            }else if(chatList[chatList.length-1].content==null) {
                chatList[chatList.length-1].content = arg;
            }else {
                chatList[chatList.length-1].content += arg;
            }            
        }
        
        for (var i in chatList){
            returnHTML += '<div class="clearfix">  <div class="message others">';
            if(config.showAvatar)
               returnHTML += ' <div class="avatar" data-author-id="lj"> <img src="http://c1.mifile.cn/f/i/hd/2016051101/a-lj.png" alt="雷军"> </div>';
            returnHTML += ' <div class="content">';
            if(config.showAuthor)
               returnHTML += '<p class="author_name">' + chatList[i].author + '</p>';
            returnHTML += ' <div class="bubble  bubble_default left"> <div class="bubble_cont"> <div class="plain"> <pre>' + chatList[i].content + '</pre> </div> </div> </div>  </div> </div>  </div>';
        }
        return '<div class="chatContent" id="chatContent">' + returnHTML + '</div>';
},{
  async: true,
  ends: false
});

