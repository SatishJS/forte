var jar = new CookieJar({
  expires:31536000, // seconds
  path: '/'
});

var upvote = function(song_id, playlist_hash, song_votes) {
  vote = 0;
  up_id = "#up_" + song_id;
  down_id = "#down_" + song_id;
  song_votes = parseInt(song_votes);
  original_votes = song_votes;
  if ($j(up_id).hasClass('secondary') === true) {
    $j(up_id).removeClass('secondary');
    song_votes += 1;
    vote = 1;
  } else {
    $j(up_id).addClass('secondary');
    song_votes -= 1;
    vote = 0;
  }
  if ($j(down_id).hasClass('secondary') === false) {
    $j(down_id).addClass('secondary');
    song_votes += 1;
  }
  change_of_votes = song_votes - original_votes;
  if (change_of_votes > 0) {
    $j.post("/playlists/" + playlist_hash + "/" + song_id + "/up/" + change_of_votes);
  } else {
    $j.post("/playlists/" + playlist_hash + "/" + song_id + "/down/" + Math.abs(change_of_votes));
  }
  $j("#votes_" + song_id).text(song_votes);
  sortSongs();
  addToCookie(song_id, vote);
};

var downvote = function(song_id, playlist_hash, song_votes) {
  vote = 0;
  up_id = "#up_" + song_id;
  down_id = "#down_" + song_id;
  song_votes = parseInt(song_votes);
  console.log
  original_votes = song_votes;
  if ($j(down_id).hasClass('secondary') === true) {
    $j(down_id).removeClass('secondary');
    song_votes -= 1;
    vote = -1;
  } else {
    $j(down_id).addClass('secondary');
    song_votes += 1;
    vote = 0;
  }
  if ($j(up_id).hasClass('secondary') === false) {
    $j(up_id).addClass('secondary');
    song_votes -= 1;
  }
  change_of_votes = song_votes - original_votes;
  if (change_of_votes > 0) {
    $j.post("/playlists/" + playlist_hash + "/" + song_id + "/up/" + change_of_votes);
  } else {
    $j.post("/playlists/" + playlist_hash + "/" + song_id + "/down/" + Math.abs(change_of_votes));
  }
  $j("#votes_" + song_id).text(song_votes);
  sortSongs();
  addToCookie(song_id, vote);
};



var sortSongs = function(){
 // $j('#Grid>li').tsort('div>div>p',{order:'desc'});

  var $Ul = $j('#Grid');
$Ul.css({position:'relative',height:$Ul.height(),display:'block'});
var iLnH;
var $Li = $j('ul>li');
$Li.each(function(i,el){
  var iY = $j(el).position().top;
  $j.data(el,'h',iY);
  if (i===1) iLnH = iY;
});
$Li.tsort('div>div>h5',{order:'desc'}).each(function(i,el){
  var $El = $j(el);
  var iFr = $j.data(el,'h');
  var iTo = i*iLnH;
  $El.css({position:'absolute',top:iFr}).animate({top:iTo},500);
});

 //$j('#Grid').mixitup('sort',['votes','asc']);
};

var checkCookie = function() {
  var forte = jar.get('forte');
  if (forte != null) {
   // console.log(forte);
  } else {
    forte = {};
    jar.put('forte', forte);  
  }
  return;
};

var addToCookie = function(song_id, vote) {
  checkCookie();
  var forte = jar.get('forte');
  if(vote == 0) {
    delete forte[song_id];
  } else {
    forte[song_id] = vote;
  }
  jar.put('forte', forte);
};

var applyVotes = function() {
  var forte = jar.get('forte');
  for (song in forte) {
    if (forte[song] == 1) {
      up_id = "#up_" + song;
      $j(up_id).removeClass("secondary");
    } else {
      down_id = "#down_" + song;  
      $j(down_id).removeClass("secondary");
    }
  }
};