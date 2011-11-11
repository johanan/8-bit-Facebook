$(document).ready(function() {  
            	
            	FB.init({
    appId  : 'YOUR_APP_ID',
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    oauth  : true, // enable OAuth 2.0
	xfbml   : true
  });
	 	
	var firstFBView = Backbone.View.extend({
		el: $('#bio'),
 
		initialize: function(){
		this.jQel = $(this.el);
			
      	_.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       
       this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	render: function(){
    		this.jQel.empty();
      		
      		var fbImage = new Image;
			fbImage.src = "http://graph.facebook.com/" + this.model.id + "/picture?type=normal";
			fbImage.className = 'fb-pics';
			fbImage.pixelize();

			this.jQel.append(fbImage);
			var bioDiv = "<div>";
			bioDiv += this.model.first_name.toUpperCase() + " - " + this.model.gender.toUpperCase();
			if(this.model.bio){
				bioDiv += "<p>BIO - " + this.model.bio.toUpperCase() + "</p>";
			}
			
			this.jQel.append(bioDiv += "</div>");
			$('#lofTitle').html("THE LEGEND OF " + this.model.name.toUpperCase());
    	}
	});	
	
	var lofNotLoggedInView = Backbone.View.extend({
		el: $('#lofHeader'),
		
		initialize: function(){
		this.jQel = $(this.el);
		
      	_.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       
       this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	render: function(){
    		this.jQel.empty();
    		var htmlText = "A FEW MONTHS AGO A WEB DEVELOPER <span class=\"red_highlight\">\" JOSHUA \"</span> HAD STARTED TO COLLECT NES GAMES. THIS LED <span class=\"red_highlight\">\" JOSHUA \"</span> TO WONDER WHAT WOULD A BROWSER LOOK LIKE ON THE NES.\
    		HE THEN DEVELOPED THE LEGEND OF FACEBOOK AS AN INTELLECTUAL EXERCISE TO WHAT A BROWSER WOULD LOOK LIKE ON THE NES.";
    		this.jQel.append(htmlText);
    		
    		var danger = "<p>IT'S DANGEROUS TO GO ALONE! USE THIS.</p>";
    		this.jQel.append(danger);
    		
    		var logButt = document.createElement('fb:login-button');
    		logButt.setAttribute('scope', 'user_photos, user_about_me, user_status, friends_photos, friends_about_me, friends_status, read_stream');
			this.jQel.append(logButt);
			FB.XFBML.parse();
    	}
		
	});	
	
	var lofMainMenuView = Backbone.View.extend({
		el: $('#lofHeader'),
		
		initialize: function(){
		this.jQel = $(this.el);
		this.jQel.empty();
		
      	_.bindAll(this, 'render', 'photos', 'remove', 'posts', 'friends'); // fixes loss of context for 'this' within methods
       
       //this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	events: {
			'click li#photos': 'photos',
			'click li#albums': 'albums',
			'click li#posts' : 'posts',
			'click li#friends' : 'friends'
		},
    	
    	render: function(){
    		var firstView = new firstFBView({model: this.model});
    		this.jQel.append("<div>MENU SELECT</div><ul><li id=\"photos\">PHOTOS</li><li id=\"albums\">ALBUMS</li><li id=\"posts\">POSTS</li><li id=\"friends\">FRIENDS</li></ul><span></span>" );	
    	},
    	
    	photos: function(){
    		this.options.router.navigate('photos/' + this.model.id, true);
    	},
    	
    	albums: function(){
    		this.options.router.navigate('albums/' + this.model.id, true);
    	},
    	
    	posts: function(){
    		this.options.router.navigate('posts/' + this.model.id, true);
    	},
    	
    	friends: function(){
    		this.options.router.navigate('friends/' + this.model.id, true);
    	},
    	
    	remove: function(){
    		$(this.el).unbind();
    		$('#lofBody').empty();
    	}
	});
	
	var lofPictureView = Backbone.View.extend({
		el: $('#lofBody'),
		
		events: {
			'click button#nextPage' : 'nextPage',
			'click button#prevPage'	: 'prevPage'
		},
		
		initialize: function(){
		this.jQel = $(this.el);
		
      	_.bindAll(this, 'render', 'nextPage', 'prevPage'); // fixes loss of context for 'this' within methods
       
       //this.render(); // not all views are self-rendering. This one is.
    	},
    	 
    	render: function(){
    		this.jQel.empty();
    		var ulist = document.createElement('ul');
    		this.jQel.append(ulist);
    	
    		for (photo in this.model.data)
    		{
    			var test = "<li>";
    			test += "<img src=\"" + this.model.data[photo].source + "\" class=\"fb-pics\">";
    			if(this.model.data[photo].comments){
    				test += "COMMENTS: " + this.model.data[photo].comments.data.length;
    			}
    			test += "</li>";

    			this.jQel.children('ul').append(test);
    		}
    		$('.fb-pics').each(function(){
    			this.pixelize();
    		});
    		
    		var buttonDiv = document.createElement('div');
    		buttonDiv.id = 'buttonDiv';
    		
    		this.jQel.append(buttonDiv);
    		
    		if(this.model.paging.previous)
    		{
	    		var prevButton = document.createElement('button');
	    		prevButton.innerHTML = 'PREVIOUS';
	    		prevButton.id = 'prevPage';
	    		this.jQel.children('div').append(prevButton);
    		}
    		
    		if(this.model.paging.next)
    		{
	    		var nextButton = document.createElement('button');
	    		nextButton.innerHTML = 'NEXT';
	    		nextButton.id = 'nextPage';
	    		this.jQel.children('div').append(nextButton);
    		}
    		
    	},
    	
    	nextPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.next + '&callback=?', function(response){
				loadPhoto(response, This.options.currUser);
			});
    	},
    	
    	prevPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.previous + '&callback=?', function(response){
				loadPhoto(response, This.options.currUser);
			});
    	}
	});	
	
	var lofAlbumView = Backbone.View.extend({
		el: $('#lofBody'),
		
		events: {
			'click li' : 'album',
			'click button#nextPage' : 'nextPage',
			'click button#prevPage'	: 'prevPage'
		},
		
		initialize: function(){
		this.jQel = $(this.el);
      	_.bindAll(this, 'render', 'album', 'nextPage', 'prevPage'); // fixes loss of context for 'this' within methods
    	},
    	
    	render: function(){
    		this.jQel.empty();
    		var ulist = document.createElement('ul');
    		
    		for (a in this.model.data)
    		{
    			if (this.model.data[a].count)
    			{
    				var albumLi = document.createElement('li');
    				albumLi.setAttribute('data-album-id', this.model.data[a].id);
    				albumLi.innerHTML = this.model.data[a].name.toUpperCase();
	    			//var albumLi = "<li data-album-id=" + this.model.data[a].id + ">";
	    			//albumLi += this.model.data[a].name.toUpperCase();
	    			//albumLi += "</li>";
	    			ulist.appendChild(albumLi);
    			}
    		}
    		this.jQel.append(ulist);
    		
    		if(this.model.paging.previous)
    		{
	    		var prevButton = document.createElement('button');
	    		prevButton.innerHTML = 'PREVIOUS';
	    		prevButton.id = 'prevPage';
	    		this.jQel.append(prevButton);
    		}
    		
    		if(typeof this.model.paging.next != 'undefined')
    		{
	    		var nextButton = document.createElement('button');
	    		nextButton.innerHTML = 'NEXT';
	    		nextButton.id = 'nextPage';
	    		this.jQel.append(nextButton);
    		}
    	},
    	
    	album: function(ev){
    		window.location.hash = '/albums/' + $(ev.target).attr('data-album-id') + '/photos';
    	},
    	
    	nextPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.next + '&callback=?', function(response){
				loadAlbum(response, This.options.currUser);
			});
    	},
    	
    	prevPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.previous + '&callback=?', function(response){
				loadAlbum(response, This.options.currUser);
			});
    	}
	});
	
	var lofPostsView = Backbone.View.extend({
		el: $('#lofBody'),
		
		events: {
			'click li' : 'post',
			'click button#nextPage' : 'nextPage',
			'click button#prevPage'	: 'prevPage'
		},
		
		initialize: function(){
		this.jQel = $(this.el);
      	_.bindAll(this, 'render', 'nextPage', 'prevPage', 'post'); // fixes loss of context for 'this' within methods
       
       this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	render: function(){
    		this.jQel.empty();
    		
    		var postList = document.createElement('ul');
    		
    		
    		for (a in this.model.data)
    		{
    			var li = "<li data-post-id=\"" +  this.model.data[a].id + "\">";
    			if (this.model.data[a].message)
    			{
	    			li +=  this.model.data[a].message.toUpperCase();
	    			
    			}
    			if (this.model.data[a].story)
    			{
	    			li += this.model.data[a].story.toUpperCase();
	    			
    			}
    			if(this.model.data[a].caption)
    			{
    				li += "<div>" + this.model.data[a].caption.toUpperCase() + "</div>";
    			}
    			if(this.model.data[a].description)
    			{
    				li += "<div>" + this.model.data[a].description.toUpperCase() + "</div>";
    			}
    			if (this.model.data[a].name)
    			{
	    			li +=  "<div>" + this.model.data[a].name.toUpperCase() + "</div>";
	    			
    			}
    			if(this.model.data[a].comments.count > 0){
    				li += "<div>COMMENTS: " + this.model.data[a].comments.count + "</div>";
    			}
    			if(this.model.data[a].likes){
    				li += "LIKES: " + this.model.data[a].likes.count;
    			}
    			li += "</li>";
    			postList.innerHTML += li;
    		}
    		
    		this.jQel.append(postList);
    		
    		$('.fb-pics').each(function(){
    			this.pixelize();
    		});
    		
    		if(this.model.paging.previous)
    		{
	    		var prevButton = document.createElement('button');
	    		prevButton.innerHTML = 'PREVIOUS';
	    		prevButton.id = 'prevPage';
	    		$(this.el).append(prevButton);
    		}
    		
    		if(typeof this.model.paging.next != 'undefined')
    		{
	    		var nextButton = document.createElement('button');
	    		nextButton.innerHTML = 'NEXT';
	    		nextButton.id = 'nextPage';
	    		$(this.el).append(nextButton);
    		}
    		
    	},
    	
    	post: function(ev){
    		if(!$(ev.target).attr('data-post-id')){
    			var postid = $(ev.target).parent('li').attr('data-post-id')
    		}else{
    			var postid = $(ev.target).attr('data-post-id');
    		}
    		window.location.hash = '/post/' + postid;
    	},
    	
    	nextPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.next + '&callback=?', function(response){
				loadPosts(response);
			});
    	},
    	
    	prevPage: function(){
    		var This = this;
			this.close();
			$.getJSON(this.model.paging.previous + '&callback=?', function(response){
				loadPosts(response);
			});
    	},  
	});
	
	var lofCommentsView = Backbone.View.extend({
		el: $('#lofBody'),
		
		events: {

		},
		
		initialize: function(){
		this.jQel = $(this.el);
      	_.bindAll(this, 'render'); // fixes loss of context for 'this' within methods
       
       this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	render: function(){
    		this.jQel.empty();
    		
    		var html = "";
    		if(this.model.name){
    			html += "<div>" + this.model.name.toUpperCase() +"</div>";
    		}
    		if (this.model.picture)
    			{
    				html += "<img src=\"" + this.model.picture + "\" class=\"fb-pics\">";
    			}
    		if (this.model.message)
    			{
	    			html +=  this.model.message.toUpperCase();
	    			
    			}
    			if (this.model.story)
    			{
	    			html += this.model.story.toUpperCase();
	    			
    			}
    		if(this.model.caption){
				html += "<div>" + this.model.caption.toUpperCase() + "</div>";
			}
			if(this.model.description){
				html += "<div>" + this.model.description.toUpperCase() + "</div>";
			}
			
			this.jQel.append(html);

			if(this.model.comments){
				var ul = document.createElement('ul');
				
	    		for (a in this.model.comments.data)
	    		{
	    			var li ="<li>";
	    			 li += "<div>" + this.model.comments.data[a].message.toUpperCase() + "</div>";
	    			 li += "<img src=\"http://graph.facebook.com/" + this.model.comments.data[a].from.id + "/picture\" class=\"fb-pics\">";
	    			 li += this.model.comments.data[a].from.name.toUpperCase();
	    			 li += "</li>";
	    			 ul.innerHTML += li;
	    		}
	    		
	    		this.jQel.append(ul);
	    	}
    		
    		$('.fb-pics').each(function(){
    			this.pixelize();
    		});
    	}
	});
	
	var lofFriendView = Backbone.View.extend({
		el: $('#lofBody'),
		
		events: {
			'click li' : 'contextSwitch'
		},
		
		initialize: function(){
      	_.bindAll(this, 'render', 'contextSwitch'); // fixes loss of context for 'this' within methods
       
       this.render(); // not all views are self-rendering. This one is.
    	},
    	
    	render: function(){
    		$(this.el).empty();
    		
    		var ulist = document.createElement('ul');
    		$(this.el).append(ulist);
    		
    		for (a in this.model.data)
    		{
    			var li = "<li data-friend-id=\"" +  this.model.data[a].id + "\">";
    			
    			li += "<img src=\"http://graph.facebook.com/" + this.model.data[a].id + "/picture\" class=\"fb-pics\">";
	    		li +=  this.model.data[a].name.toUpperCase();
    			li += "</li>";
    			$(this.el).children('ul').append(li);
    		}
    		
    		$('.fb-pics').each(function(){
    			this.pixelize();
    		});
    	},
    	
    	contextSwitch: function(ev){
    		window.location.hash = 'fbid/' + $(ev.target).attr('data-friend-id');
    	}
	});
	
	var Workspace = Backbone.Router.extend({

	  routes: {
	    "fbid/:fbid": "index",
	    "albums/:albumid/photos" : "albumPhotos",
	    "albums/:fbid": "albums",
	    "photos/:fbid" : "photo",
	    "posts/:fbid" : "posts",
	    "post/:postid" : "post",
	    "friends/:fbid" : "friends"

	  },
	
	initialize: function(options){
    this.ac = options.ac;
    this.currUser = null;
    this.body = $('#lofBody');
    this.header = $('#lofHeader');
  	},
  
	  index: function(fbid) {
	  	this.body.unbind();
	  	this.body.empty();
	  	this.header.unbind();
	  	var This = this;
		this.ac.id = fbid;
		var test = fbUser('/' + fbid, function(model){
	    	This.ac.menuView(model, This);
		});	
	  },
	  
	  albumPhotos: function(albumid){
	  	this.body.unbind();
	  	var This = this;
	  	var data = fbUser('/' + albumid + '/photos', function(model){
	  		This.ac.photoView(model);
	  	});
	  },
	  
	  albums: function(fbid) {
	  	this.body.unbind();
	  	this.body.empty(); 	
	  	var This = this;
	  	var albumView = fbUser('/' + this.ac.id + '/albums', function(model){
	    	This.ac.albumView(model);
		});	
	  },
	  
	  photo: function(fbid){
	  	$('#lofBody').unbind();
	  	var This = this;
	  	this.ac.id = fbid;
	  	var photoView = fbUser('/' + this.ac.id + '/photos', function(model){
	  		This.ac.photoView(model);
	  	});
	  },
	  
	  posts: function(fbid){
	  	this.body.unbind();
	  	fbUser('/' + fbid + '/posts', function(model){
	  		var postsView = new lofPostsView({model: model});
	  	});
	  },
	  
	  post: function(postid){
	  this.body.unbind();
	  fbUser('/' + postid, function(model){
	  	var postView = new lofCommentsView({model: model});
	  });
	  
	},
	
	friends: function(fbid){
		this.body.unbind();
		fbUser('/' + fbid + '/friends', function(model){
			var fView = new lofFriendView({model: model});
		});	
	}
	});
	
    FB.Event.subscribe('auth.login', function(response) {
        startThis();
        });

	FB.getLoginStatus(function(response) {
  if (response.authResponse) {		
  	startThis();	
  } else {
	var notloggedinView = new lofNotLoggedInView();
  }
  
  
  
});

Backbone.View.prototype.close = function(){
  $(this.el).unbind();
}

function AppController(){
	this.currUser = null;
	this.currentView = null;
	this.id = 'me';
	this.header = false;
	
	this.getUser = function(callback){
		if(this.currUser){
			callback(this.currUser);
		}else{
			var This = this;
			var user = fbUser('/' + this.id, function(model){
			    This.currUser = model;
			    callback(model);
			});	
		}
	}
	
	this.header = function(){
		var header = new firstFBView({model: this.currUser});
	}
	
	this.menuView = function(model, router){
		//reset everything
		this.currUser = model;
		var menu = new lofMainMenuView({model: model, router: router});
		menu.render();
		this.header = true;
	}
	
	this.albumView = function(model){
		var albumView = new lofAlbumView({model: model, currUser: this.currUser});
		albumView.render();
	}
	
	this.photoView = function(model){
		var photoView = new lofPictureView({model: model, currUser: this.currUser});
		photoView.render();
	}
	
	this.viewChange = function(view){
		if (this.currentView){
    		this.currentView.close();
	    }
	
	    this.currentView = view;
	    view.render();
		}
}

function startThis() {
		var ac = new AppController();
		
		var ws = new Workspace({ac: ac});
		Backbone.history.start();
		if(window.location.hash == ""){
			ws.navigate('fbid/me', true);
		}
};
  
function startapp(model) {
	var menuView = new lofMainMenuView({model: model});
}

function loadPhoto(response, meModel){
	var photoView = new lofPictureView({model: response, currUser: meModel});
	photoView.render();
}

function loadAlbum(response, meModel){
	var albumView = new lofAlbumView({model: response, currUser: meModel});
	albumView.render();
}

function loadPosts(response){
	var posts = new lofPostsView({model: response});
	//posts.render();
}

function fbUser(fbid, callback){
		FB.api(fbid, function(response){
				callback(response);
			});
}
});  