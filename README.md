

# Greetings to all!


## Immediately short:
This is a plugin for quick and easy creation of dialogs (modal windows) on your page.
### Setup and using:
connect ***dialogPanel.css*** and ***dialogPanel.js*** after jQuery connecting.

#### creation:

	$(element).dialogPanel("open", options);
	//returns: $element
#### options:

	//Type: Object
	{
		dialogName:custom dialog name (if needed, default: ""),
		//Type: Array
		content:[
			component1,
			component2,
			component1,
			//....
		],
		//callback function, default: function(){}
		func:function(request){
			
		}
	}
dialogName will be saved in "dialogname" attribute of modal window. In the future, this window can be found by using (CSS Attribute Selectors)[https://www.w3schools.com/css/css_attribute_selectors.asp].
#### components:
	//Type: Object
	{
		type:componentType,
		arg1:...,
		//some args...
	}
values:

| type value | info | args | args values |
|--|--|--|--|
|           |  | attr | applies to the current component jQuery.attr (this arg there is in all components) |
|           |  | init | callback: `function($that_component,dialog_uid)` (this arg there is in all components) |
| "message" | display some text message (special characters (for example, \\n) will be displayed normally) | text | some text |
| "button" | add button in modal-window footer | btntext | some text |
|           |  | btnID | text id of button |
| "textarea" or "input" | displays an input or textarea and has the same arguments | inpID | text id of input or textarea |
| "select" | displays select | selID | text id of select |
|  |  | options | object: `{value:... , text:...}` where value is option value, text- displayed option text |
| "checkbox" | displays checkbox | chcID | text id of checkbox |
| "custom" | add div with width=100% |  |  |
| "uploader" | add file selector | uplID | text id of uploader |
||| accept | allowed file types (same as input type=file) |
||| multiple | if true- allows multiple file selection |
||| upltext | the text that will initially be displayed on uploader |
#### request:

    //Type: Object
    {
		pressed:btnID of pressed button,
		//Type: Object
		values:{
			inpID:input value
		},
		//Type: Object
		checked:{
			chcID:checkbox state - true/false
		},
		//Type: Object
		fileLists:{
			//Type: FileList
			uplID:files list
		}
	}

## Example:

    jQuery("body").dialogPanel("open",{
		content:[{
			type:"message",
			text:"example message"
		},{
			type:"input",
			attr:{
				placeholder:"input text"
			},
			inpID:"ex"
		},{
			type:"message",
			text:"Did you enter the text?"
		},{
			type:"button",
			btntext:"ok",
			btnID:"ok"	
		},{
			type:"button",
			btntext:"cancel",
			btnID:"canc"	
		}],
		func:function(req){
			if(req.pressed!=="ok")
				return;
			alert(req.values.ex);
		}
	});
