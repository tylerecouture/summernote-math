# summernote-math
A summernote plugin that uses [KaTeX](https://khan.github.io/KaTeX/) to insert rendered math.

### Working Example

https://rawgit.com/tylerecouture/summernote-math/master/Example/example.html

### Usage

1. Include the js
2. add `math` to your toolbar:
```
 $('#summernote').summernote({
     toolbar: [
         ...
         ['insert', ['pitcure', 'link', 'math']],
     ]
 });
```
