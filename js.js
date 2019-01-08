(function ($) {
	var m = {
		getUID: function () {
			var req = "",
			chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < 15; i++)
				req += chars.charAt(Math.floor(Math.random() * chars.length));
			return "_" + req;
		},
		src: {
			input: '<input type="text" class="inputstyle cls">',
			textarea: '<textarea type="text" class="inputstyle cls"></textarea>',
			button: '<button class="blackbtn bwhitefont cls"></button>',
			checkbox: '<label class="chbstyle"><input type="checkbox" hidden><div>&#10003;</div><text></text></label>',
			uploader: '<label class="uploaderstyle cls"><div></div><input type="file" hidden></label>'
		},
		open: function (param) {
			window.focus();
			var s = $.extend({
					content: [],
					func: function () {}
				}, param),
			a = $(this[0] ? this[0] : $("body")[0]),
			dialogback = a.children(".dialogPanel_dialogback")[0],
			inpcount = 0,
			UID = m.getUID(),
			dialog = (dialogback || (dialogback=a[0].appendChild($('<div class="dialogPanel_dialogback"></div>')[0])))
				.appendChild($('<div class="dialog" uid="' + UID + '"><div class="scrollplane"></div><div class="downmenu"></div>')[0]);
				console.log(dialog);
			var bc = dialog.querySelector(".scrollplane"),
			fn = function (e) {
				var data = {
					pressed: e.data.pressed,
					values: {},
					checked: {},
					fileLists: {}
				}
				dialog.querySelectorAll(".scrollplane>input,.scrollplane>textarea").forEach(function (el) {
					data.values[el.getAttribute("iid")] = el.value;
				});
				dialog.querySelectorAll(".scrollplane>.uploaderstyle>input").forEach(function (el) {
					data.fileLists[el.getAttribute("uid")] = el.files;
				});
				dialog.querySelectorAll(".scrollplane>.chbstyle>input").all(function (el) {
					data.checked[el.getAttribute("cid")] = el.checked;
				});
				a.dialogPanel("close", UID);
				s.func(data);
			};

			a.dialogPanel("toTop", UID);
			dialogback.removeAttribute("dialogPanel_hidden");

			s.content.forEach(function (el, ind) {
				switch (el.type) {
				case "message":
					$(bc.appendChild($('<pre class="message">' + el.text + '</pre>')[0])).attr(el.attr || {});
					break;
				case "button":
					var btn = dialog.querySelector(".downmenu").appendChild($(m.src.button)[0]);
					btn.setAttribute("bid", el.btnID);
					btn.innerHTML = el.btntext || "";
					btn = $(btn);
					btn.on("click", {
						pressed: el.btnID
					}, fn);
					btn.attr(el.attr || {});
					break;
				case "textarea":
				case "input":
					var inp = bc.appendChild($(m.src[el.type])[0]);
					inp.setAttribute("iid", el.inpID);
					$(inp).attr(el.opt || {});
					if (inpcount < 1)
						inpcount++,
						inp.focus();
					break;
				case "checkbox":
					var ch = $(bc.appendChild($(m.src.checkbox)[0]));
					bc.appendChild($("<br>"));
					ch.children("input")
					.attr("cid", el.chcID)
					.attr(el.attr || {});
					ch.children("text").html(el.chctext);
					break;
				case "uploader":
					var upl = $(bc.appendChild($(m.src.upoader)[0])),
					uplTxt = upl.children("div"),
					uplInp = upl.children("input").attr("uid", el.uplID);
					uplInp[el.accept ? "attr" : "removeAttr"]("accept", el.accept);
					uplInp[el.accept ? "attr" : "removeAttr"]("multiple", el.multiple && "true").attr(el.attr || {});

					uplTxt.html(el.upltext || "");
					upl.on("change", function () {
						var txt = "";
						for (var i = 0, len = upl.files.length; i < len; i++) {
							txt += uplInp[0].files[i].name + "<br>";
						}
						uplTxt.html(txt);
					});
					break;
				}
			});
			return a;
		},
		close: function (uid) {
			var a = $(this[0] ? this[0] : $("body")[0]),
			db = a.children(".dialogPanel_dialogback")[0],
			dialog = $(".dialog[uid=" + uid + "]");
			if (!db || !dialog[0])
				return a;
			(dialog = [
					dialog,
					dialog.prev()
				], dialog[0]).remove();
			if (!db.children.length)
				db.setAttribute("dialogPanel_hidden", ".");
			else
				a.dialogPanel("toTop", dialog[1].attr("uid"));
			return a;
		},
		getLargestLayer: function (db,elem) {
			db=$(db);
			var tl = 0,
			cur = 0,
			re;
			db.children("[toplayer_queue]").each(function (ind,el) {
				tl = parseFloat(el.getAttribute("toplayer_queue"));
				if (cur < tl)
					cur = tl,
					re = el;
			});
			return elem ? $(re) : cur;
		},
		toTop: function (uid) {
			var a = $(this[0] ? this[0] : $("body")[0]),
			db = a.children(".dialogPanel_dialogback"),
			dialog = $(".dialog[uid=" + uid + "]"),
			t1;
			if (!db[0] || !dialog[0])
				return a;
			tl = db.children("[toplayer]");
			tl[0] && tl
			.attr("toplayer_queue", a.dialogPanel("getLargestLayer", db) + 1)
			.removeAttr("toplayer");
			dialog.removeAttr("toplayer_queue").attr("toplayer",".");
			return a;
		}
	};
	$.fn.dialogPanel = function (action, param) {
		return m[action].call(this, param);
	};
})(jQuery);
