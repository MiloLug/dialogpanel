(function (A) {
	var m = {
		getUID: function () {
			var req = "",
			chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < 15; i++)
				req += chars.charAt(Math.floor(Math.random() * chars.length));
			return "_" + req;
		},
		src: {
			input: '<input type="text" class="dialogPanel_input dialogPanel_cls">',
			textarea: '<textarea type="text" class="dialogPanel_input dialogPanel_cls"></textarea>',
			button: '<button class="dialogPanel_button dialogPanel_cls"></button>',
			checkbox: '<label class="dialogPanel_checkbox"><input type="checkbox" hidden><div>&#10003;</div><text></text></label>',
			uploader: '<label class="dialogPanel_uploader dialogPanel_cls"><div></div><input type="file" hidden></label>',
			select: '<select class="dialogPanel_select dialogPanel_cls"></select>',
			custom: '<div class="dialogPanel_custom"></div>'
		},
		open: function (param) {
			window.focus();
			var s = A.args({
					content: [],
					dialogName: "",
					init: function () {},
					attr: {},
					func: function () {}
				}, param),
			a = this !== window ? this : A("body").a(),
			dialogback = a.child(".dialogPanel_dialogback",!1,!0),
			inpcount = 0,
			UID = m.getUID(),
			dialog = (dialogback || (dialogback = a.addElem('<div class="dialogPanel_dialogback"></div>')))
			.addElem('<div class="dialogPanel_dialog" uid="' + UID + '"><div class="scrollplane"></div><div class="downmenu"></div>'),
			jqdialog = dialog.opt("dialogname", s.dialogName).opt(s.attr || {});
			var bc = dialog.querySelector(".scrollplane"),
			fn = function (e,pressed) {
				var data = {
					pressed: pressed,
					values: {},
					checked: {},
					fileLists: {}
				}
				dialog.querySelectorAll(".scrollplane>input,.scrollplane>textarea").forEach(function (el) {
					data.values[el.getAttribute("iid")] = el.value;
				});
				dialog.querySelectorAll(".scrollplane>.dialogPanel_uploader>input").forEach(function (el) {
					data.fileLists[el.getAttribute("uid")] = el.files;
				});
				dialog.querySelectorAll(".scrollplane>.dialogPanel_checkbox>input").forEach(function (el) {
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
					var msg = bc.addElem('<pre class="message">' + el.text + '</pre>');
					msg.opt(el.attr || {});
					el.init && el.init(msg, UID, m);
					break;
				case "button":
					var btn = dialog.querySelector(".downmenu").addElem(m.src.button);
					btn
					.opt("bid", el.btnID)
					.html(el.btntext || "")
					.on("click", function(e){fn(e,el.btnID);});
					btn.opt(el.attr || {});
					el.init && el.init(btn, UID, m);
					break;
				case "textarea":
				case "input":
					var inp = bc.addElem(m.src[el.type]);
					inp.opt("iid", el.inpID).opt(el.attr || {});
					if (inpcount < 1)
						inpcount++,
						inp.focus();
					el.init && el.init(inp, UID, m);
					break;
				case "select":
					var inp = bc.addElem(m.src.select),
					tmp;
					inp.opt("sid", el.selID).opt(el.attr || {});
					el.options && el.options.forEach(function (obj) {
						tmp = inp[0].addElem("<option></option>");
						tmp.value = obj.value;
						tmp.innerHTML = obj.text;
					});
					el.init && el.init(inp, UID, m);
					break;
				case "checkbox":
					var ch = bc.addElem(m.src.checkbox);
					bc.addElem("<br>");
					ch.child("input")
					.opt("cid", el.chcID)
					.opt(el.attr || {});
					ch.child("text").html = el.chctext;
					el.init && el.init(ch, UID, m);
					break;
				case "custom":
					var cust = bc.addElem(m.src.custom);
					cust.opt(el.attr || {});
					el.init && el.init(cust, UID, m);
					break;
				case "uploader":
					var upl = bc.addElem(m.src.upoader),
					uplTxt = upl.child("div"),
					uplInp = upl.child("input").opt("uid", el.uplID);
					uplInp[el.accept ? "opt" : "removeAttribute"]("accept", el.accept);
					uplInp[el.multiple ? "opt" : "removeAttribute"]("multiple", el.multiple && "true");
					uplInp.opt(el.attr || {});
					uplTxt.html = el.upltext || "";
					upl.on("change", function () {
						var txt = "";
						for (var i = 0, len = upl.files.length; i < len; i++) {
							txt += uplInp[0].files[i].name + "<br>";
						}
						uplTxt.html = txt;
					});
					el.init && el.init(upl, UID, m);
					break;
				}
			});
			s.init(jqdialog, UID, m);
			return a;
		},
		close: function (uid) {
			var a = this !== window ? this : A("body").a(),
			db = a.child(".dialogPanel_dialogback",!1,!1),
			dialog = (".dialogPanel_dialog[uid=" + uid + "]").a();
			if (!db || !dialog)
				return a;
			(dialog = [
					dialog,
					dialog.previousElement
				], dialog[0]).remElem();
			if (!db.child("*",!0,!0).length)
				db.setAttribute("dialogPanel_hidden", ".");
			else
				a.dialogPanel("toTop", dialog[1].opt("uid"));
			return a;
		},
		getLargestLayer: function (db, elem) {
			var tl = 0,
			cur = 0,
			re;
			db.child("[toplayer_queue]",!0,!0).all(function (el) {
				tl = parseFloat(el.getAttribute("toplayer_queue"));
				if (cur < tl)
					cur = tl,
					re = el;
			});
			return elem ? re : cur;
		},
		toTop: function (uid) {
			var a = this !== window ? this : A("body").a(),
			db = a.child(".dialogPanel_dialogback",!1,!0),
			dialog = (".dialogPanel_dialog[uid=" + uid + "]").a(),
			t1;
			if (!db[0] || !dialog[0])
				return a;
			tl = db.child("[toplayer]",!1,!0);
			tl && tl
			.opt("toplayer_queue", a.dialogPanel("getLargestLayer", db) + 1)
			.removeAttribute("toplayer");
			dialog.removeAttribute("toplayer_queue");
			dialog.opt("toplayer", ".");
			return a;
		}
	};
	A({
		dialogPanel : function (action, param, exp) {
			return m[action].call(this.a(), param, exp);
		}
	});
})(A);
