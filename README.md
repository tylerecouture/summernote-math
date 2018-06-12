# summernote-math
A summernote plugin that uses [KaTeX](https://khan.github.io/KaTeX/) to insert rendered math.  

### Working Example

https://rawgit.com/tylerecouture/summernote-math/master/Example/example.html

### Usage
1. Include KaTex:
    1.  https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.css
    2.  https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/katex.min.js
1. Include summernote-math.js:
 
2. add `math` to your toolbar somewhere:
```
 $('#summernote').summernote({
     toolbar: [
         ...
         ['insert', ['pitcure', 'link', 'math']],
     ]
 });
```

### LaTeX markup
Use [LaTeX markup, as supported by KaTeX](https://khan.github.io/KaTeX/function-support.html) to insert math. For example:

`c = \pm\sqrt{a^2 + b^2}`

or

`f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi`

### To Do

* Add ability to edit existing math elements