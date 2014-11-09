function notes(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (notebook) {
if ( notebook.notes.length)
{
buf.push("<ul>");
// iterate notebook.notes
;(function(){
  var $$obj = notebook.notes;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var note = $$obj[$index];

buf.push("<div class=\"panel panel-primary\"><div class=\"panel-heading\">" + (jade.escape(null == (jade_interp = note.title) ? "" : jade_interp)) + "<div class=\"btn-group btn-group-sm pull-right\"><a" + (jade.attrs(jade.merge([{"href": "#","class": "btn btn-success open-edit"},{"data-id":note._id}]), false)) + "> <span class=\"glyphicon glyphicon-pencil\"></span></a></div></div></div><div class=\"panel-body\"><p>" + (jade.escape(null == (jade_interp = note.content) ? "" : jade_interp)) + "</p></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var note = $$obj[$index];

buf.push("<div class=\"panel panel-primary\"><div class=\"panel-heading\">" + (jade.escape(null == (jade_interp = note.title) ? "" : jade_interp)) + "<div class=\"btn-group btn-group-sm pull-right\"><a" + (jade.attrs(jade.merge([{"href": "#","class": "btn btn-success open-edit"},{"href": "#","class": "btn btn-success open-edit"},{"data-id":note._id}]), false)) + "> <span class=\"glyphicon glyphicon-pencil\"></span></a></div></div></div><div class=\"panel-body\"><p>" + (jade.escape(null == (jade_interp = note.content) ? "" : jade_interp)) + "</p></div>");
    }

  }
}).call(this);

buf.push("</ul>");
}
else
{
buf.push("<div class=\"well\"> <p>You have not created any notes yet.</p><a href=\"/new\" class=\"btn btn-primary\">Create Note</a></div>");
}}("notebook" in locals_for_with?locals_for_with.notebook:typeof notebook!=="undefined"?notebook:undefined));;return buf.join("");
}