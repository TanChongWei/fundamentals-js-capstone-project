# fundamentals-js-capstone-project
Capstone project for fundamentals of JavaScript course

This capstone JS project involves creating a custom website that displays up to 5 comics; with each comic displaying the image, the title and the comic number. This custom website is built using only vanilla JavaScript, HTML and CSS.
Upon loading the page, users will see 3 buttons (prev, random and next) along with a radio button that will fetch the information of the corresponding webcomics from this api endpoint: https://xkcd.com/json.html
Users will also be able to specify how many comic images (1, 3 or 5 images at the moment) they wish to have displayed on the screen at any time through the radio button beside the "next" button.

# Code flow and structure
The code will flow as such:
1) On load, the first 3 comics will be loaded onto the site
2) When the previous button is clicked, the previous "x" number of comics will be fetched from the API. The number of comics to be fetched will be determined by the url parameter "toShow" while the current image number will be determined by the url parameter "Img"
3) Similarly, when the next button is clicked, the next set of comics will be fetched. The number of comics to be fetched and the current image number will be extracted from the current url parameters. 
4) The radio button listens for a change event. On change, the number of comics to be fetched and the current image number will be extracted from the current url parameters and the subsequent comic images will be rendered on the screen or the number of comics displayed will be reduced.
5) The search button is part of a form element that fetches the specified comic number from 1 to 2475. The corresponding url parameter will be updated. If a number less than 1 or more than 2475 is inputted, the form will not be submitted.
