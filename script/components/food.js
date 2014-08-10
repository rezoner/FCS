COMPONENTS.food = {

  collision: function(entity, collidable) {
    
    if(collidable.player) {
      entity.collection.remove(entity);
      collidable.radius++;
      collidable.eaten++;
    }

  }

};