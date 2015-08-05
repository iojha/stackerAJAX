$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
	// zero out results if previous search has run
	$('.results').html('');
	// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getTopAnswerers(answerers);
	});
});


// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { tagged: tags,
				    site: 'stackoverflow',
					order: 'desc',
					sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

///////////// GET INSPIRED FEATURE ////////////////


/* User Object key values from Stack Overflow API -- 
   http://api.stackexchange.com/docs/types/tag-score

 "user": {
    "reputation": 9001,
    "user_id": 1,
    "user_type": "registered",
    "accept_rate": 55,
    "profile_image": "https://www.gravatar.com/avatar/a007be5a61f6aa8f3e85ae2fc18dd66e?d=identicon&r=PG",
    "display_name": "Example User",
    "link": "http://example.stackexchange.com/users/1/example-user"
  },
  "post_count": 100,
  "score": 20
*/

// this function takes the item object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerers = function(item) {
	
	// clone our result template code
	var result = $('.templates .answerers').clone();
	
	// Set the user image in result
	var userImage = result.find('.user-image');
	userImage.attr('src', item.user.profile_image);

	// Set the user name in the result
	var userName = result.find('.user-name');
	userName.attr('href', item.user.link)
	userName.text(item.user.display_name);

	// Set the user reputation in the result
	var userReputation = result.find('.user-reputation');
	userReputation.text(item.user.reputation);

	// Set the user post count in result
	var userPostCount = result.find('.user-postcount');
	userPostCount.text(item.user.post_count);

	// Set the user score in result
	var userScore = result.find('.user-score');
	userScore.text(item.user.score);

	return result;
};

var getTopAnswerers = function(answerers) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { tag: answerers,
				    site: 'stackoverflow'
				};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/"+request.tag+"/top-answerers/all_time", // /tags/{tag}/top-answerers/{period}
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answer = showAnswerers(item);
			$('.results').append(answer);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


