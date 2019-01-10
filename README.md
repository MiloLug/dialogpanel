

# Greetings to all!


Just want to say that the project was written for myself, and only as a hobby, so I am not eager to tell all the details.

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
		//Type: Array
		content:[
			component1,
			component2,
			component1,
			//....
		],
		//Type: Function
		func:function(request){
			
		}
	}
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
|  |  | attr | applies to the current component jQuery.attr (this arg there is in all components) |
|  |  | init | callback: `function($that_component,dialog_uid)` (this arg there is in all components) |
| "message" | display some text message (special characters (for example, \\n) will be displayed normally) | text | some text |
| "button" | add button in modal-window footer | btntext | some text |
|  |  | btnID | text id of button |
| "textarea" or "input" | displays an input or textarea and has the same arguments | inpID | text id of input or textarea |
| "select" | displays select | selID | text id of select |
|  |  | options | object: `{value:... , text:...}` where value is option value, text- displayed option text |
| "checkbox" | displays checkbox | chcID | text id of checkbox |
| "custom" | add div with width=100% |  |  |
| "uploader" | add file selector | uplID | text id of uploader |
||| accept | allowed file types (same as input type=file) |
||| multiple | if true- allows multiple file selection |
||| upltext | the text that will initially be displayed on uploader |
