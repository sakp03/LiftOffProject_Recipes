(function() {
    //Default RecipeBook if no data is found in local storage
    var RecipeBook = [
      {
        name: "Recipe 1",
        ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"]
      },
      {
        name: "Recipe 2",
        ingredients: ["Ingredient 4", "Ingredient 5", "Ingredient 6"]
      },
      {
        name: "Recipe 3",
        ingredients: ["Ingredient 7", "Ingredient 8", "Ingredient 9"]
      }
    ];
  
    //get's called each time you either add, remove or edit+save a recipe from the list
    function updateLocalStorage() {
      var RecipeBook = [];
      var list = document.getElementsByClassName("recipe");
  
      for(let i = 0; i < list.length; i++) {
        var recipe = {};
        recipe.name = list[i].children[0].innerHTML;
        recipe.ingredients = [];
        var ingreds = list[i].getElementsByTagName("ul")[0].children;
        for(let i = 0; i < ingreds.length; i++) {
          recipe.ingredients.push(ingreds[i].innerHTML);
        }
        RecipeBook.push(recipe);
      }
      return JSON.stringify(RecipeBook);
    }
  
    //event handler to edit any recipe
    function editRecipe(event) {
      //get the recipe element as an entry point for manipulation
      var elt = event.target.parentNode.parentNode.parentNode;
      var recipe = {};
  
      //hide the recpe panel and show the edit panel
      var panel = elt.getElementsByClassName("panel")[0];
      panel.classList.remove("show");
      var editor = elt.getElementsByClassName("edit")[0];
      editor.classList.add("show");
  
      //fill the recipe object with the information from the recipe panel
      recipe.name = elt.getElementsByClassName("accordion")[0].innerHTML;
      recipe.ingredients = [];
      var list = elt.getElementsByTagName("li");
      for(var prop in list) {
        if(list.hasOwnProperty(prop)) {
          recipe.ingredients.push(list[prop].innerHTML);
        }
      }
  
      //and let the input fields represent the values from the recipe object
      var target = elt.getElementsByClassName("edit")[0];
      target.children[0].value = recipe.name;
      target.children[1].value = recipe.ingredients.join(",");
    }
  
    //save any edit's with this event handler
    function saveEdit(event) {
      //get the recipe Element as an entry point for manipulation
      var elt = event.target.parentNode.parentNode;
      var recipe = {};
  
      //get the updated values from the input fileds and save them in the recipe object
      recipe.name = elt.getElementsByClassName("edit")[0].children[0].value.trim();
      recipe.ingredients = elt.getElementsByClassName("edit")[0].children[1].value.split(",").filter(n => {
        if(n === "") {
          return false;
        }
        return n.trim();
      });
  
      //update the title
      elt.getElementsByClassName("accordion")[0].innerHTML = recipe.name;
  
      //delete the old ingredient list
      var newIngreds = elt.getElementsByTagName("ul")[0];
      while(newIngreds.firstChild) { 
        newIngreds.removeChild(newIngreds.firstChild); 
      }
  
      //and create a new one with the new ingredients from the array
      for(let i = 0; i < recipe.ingredients.length; i++) {
        var item = document.createTextNode(recipe.ingredients[i]);
        var listItem = document.createElement("li");
        listItem.appendChild(item);
        newIngreds.appendChild(listItem);
      }
  
      //hide the edit panel and show the recipe panel again
      var panel = elt.getElementsByClassName("panel")[0];
      panel.classList.add("show");
      var editor = elt.getElementsByClassName("edit")[0];
      editor.classList.remove("show");
  
      localStorage["Sakura_RecipeBook"] = updateLocalStorage();
    }
  
    //delete a recipe from the list
    function deleteRecipe(event) {
      //get the recipe element as an entry point for mainpulation
      var elt = event.target.parentNode.parentNode.parentNode;
      elt.parentNode.removeChild(elt);
  
      localStorage["Sakura_RecipeBook"] = updateLocalStorage();
    }
  
    //create a new empty/from localStorage recipe and add it to the list 
    function createRecipe(event, recipeindex) {
      var elt = document.getElementsByClassName("recipebox")[0];
  
      //create the recipe div
      var newRecipe = document.createElement("div");
      newRecipe.classList.add("recipe");
  
      // "TOAPPEND" the accordion button
      var accordion = document.createElement("button");
      accordion.classList.add("accordion");
      accordion.innerHTML = recipeindex != null ? recipeindex.name : "new recipe";
      accordion.onclick = toggleRecipe;
  
      // "TOAPPEND" the panel with the ingredient list and the buttons
      var panel = document.createElement("div");
      panel.classList.add("panel");
  
      //the title
      var title = document.createElement("h4");
      title.classList.add("center");
      title.innerHTML = "Ingredients";
      panel.appendChild(title);
  
      //the separator line
      var line = document.createElement("div");
      line.classList.add("line");
      panel.appendChild(line);
  
      //the unordered list
      var ul = document.createElement("ul");
      panel.appendChild(ul);
  
      if(recipeindex) {
        for(let i = 0; i < recipeindex.ingredients.length; i++) {
          var li = document.createElement("li");
          li.innerHTML = recipeindex.ingredients[i];
          ul.appendChild(li);
        }
      }
  
      //the btn-group with it's buttons
      var btn_group = document.createElement("div");
      btn_group.classList.add("btn-group");
  
      var delbtn = document.createElement("button");
      delbtn.innerHTML = "Delete";
      delbtn.onclick = deleteRecipe;
      btn_group.appendChild(delbtn);
  
      var editbtn = document.createElement("button");
      editbtn.innerHTML = "Edit";
      editbtn.onclick = editRecipe;
      btn_group.appendChild(editbtn);
      panel.appendChild(btn_group);
  
      // "TOAPPEND" the edit panel for adding and removing ingredients
      var editPanel = document.createElement("div");
      editPanel.classList.add("edit");
  
      var input = document.createElement("input");
      input.type = "text";
      editPanel.appendChild(input);
  
      var textarea = document.createElement("textarea");
      textarea.rows = "5";
      editPanel.appendChild(textarea);
  
      var save = document.createElement("button");
      save.innerHTML = "Save";
      save.onclick = saveEdit;
      editPanel.appendChild(save);
  
      //append all the children to newRecipe
      newRecipe.appendChild(accordion);
      newRecipe.appendChild(panel);
      newRecipe.appendChild(editPanel);
  
      //and insert it into the recipebox
      var parent = document.getElementsByClassName("recipebox")[0];
      var target = event.target != null ? event.target : event;
      parent.insertBefore(newRecipe, target);
  
      localStorage["Sakura_RecipeBook"] = updateLocalStorage();
    }
  
    //toggle the recipe panel with the ingredients
    function toggleRecipe(e) {
      e.target.classList.toggle("active");
      e.target.nextElementSibling.classList.toggle("show");
  
      var panel = e.target.parentNode.children[2];
      if(!e.target.classList.contains("active") && panel.classList.contains("show")) {
        e.target.classList.add("active");
        panel.classList.remove("show");
      };
    }
  
    //onpageload: parse the list of recipes form localStorage or from the default list
    (function parseRecipes() {
      document.getElementById("add-rec").onclick = createRecipe;
      var insertHere = document.getElementById("add-rec");
  
      if(localStorage.getItem("Sakura_RecipeBook") === null) {
        for(let i = 0; i < RecipeBook.length; i++) {
          createRecipe(insertHere, RecipeBook[i]);
        }
      }
      else {
        var LocalRecipeBook = JSON.parse(localStorage["Sakura_RecipeBook"]);
        for(let i = 0; i < LocalRecipeBook.length; i++) {
          createRecipe(insertHere, LocalRecipeBook[i]);
        } 
      }
    }());
    
  }());