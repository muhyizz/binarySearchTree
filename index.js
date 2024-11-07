class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  isEmpty() {
    return this.root === null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(root, newNode) {
    if (newNode.value < root.value) {
      if (root.left === null) {
        root.left = newNode;
      } else {
        this.insertNode(root.left, newNode);
      }
    } else {
      if (root.right === null) {
        root.right = newNode;
      } else {
        this.insertNode(root.right, newNode);
      }
    }
  }

  search(root, value) {
    if (!root) {
      return false;
    } else {
      if (root.value === value) {
        return true;
      } else if (value < root.value) {
        return this.search(root.left, value);
      } else {
        return this.search(root.right, value);
      }
    }
  }

  preOrder(root, array = []) {
    if (root) {
      array.push(root.value);
      this.preOrder(root.left, array);
      this.preOrder(root.right, array);
    }
    return array;
  }

  inOrder(root, array = []) {
    if (root) {
      this.inOrder(root.left, array);
      array.push(root.value);
      this.inOrder(root.right, array);
    }

    return array;
  }

  postOrder(root, array = []) {
    if (root) {
      this.postOrder(root.left, array);
      this.postOrder(root.right, array);
      array.push(root.value);
    }

    return array;
  }

  levelOrder() {
    const queue = [];
    queue.push(this.root);

    while (queue.length) {
      const currentNode = queue.shift(); //take the head of the array and put into the current queue
      console.log(currentNode.value);

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
    }
  }

  min(root) {
    if (!root.left) {
      return root.value;
    } else {
      return this.min(root.left);
    }
  }

  max(root) {
    if (!root.right) {
      return root.value;
    } else {
      return this.max(root.right);
    }
  }

  delete(value) {
    this.root = this.deletedNode(this.root, value);
  }

  depth(root) {
    if (!root) return 0;

    const leftDepth = this.depth(root.left);
    const rightDepth = this.depth(root.right);

    return Math.max(leftDepth, rightDepth) + 1;
  }

  width() {
    if (!this.root) return 0;

    const queue = [];
    queue.push(this.root);
    let maxWidth = 0;

    while (queue.length) {
      const levelWidth = queue.length;
      maxWidth = Math.max(maxWidth, levelWidth);

      for (let i = 0; i < levelWidth; i++) {
        const currNode = queue.shift();

        if (currNode.left) queue.push(currNode.left);
        if (currNode.right) queue.push(currNode.right);
      }
    }
    return maxWidth;
  }

  isBalance(root) {
    return this.checkHeight(root) != -1;
  }

  checkHeight(root) {
    if (root === null) return 0;

    const leftHeight = this.checkHeight(root.left);
    const rightHeight = this.checkHeight(root.right);

    if (leftHeight === -1 || rightHeight === -1) return -1;

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  deletedNode(root, value) {
    if (root === null) {
      return root;
    }
    if (value < root.value) {
      root.left = this.deletedNode(root.left, value);
    } else if (value > root.value) {
      root.right = this.deletedNode(root.right, value);
    } else {
      if (!root.left && !root.right) {
        return null;
      }

      if (!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }

      root.value = this.min(root.right);
      root.right = this.deletedNode(root.right, root.value);
    }
    return root;
  }
}

const buildTree = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }

  const bst = new BinarySearchTree();
  let newArray = arrayCleanDup(array);

  const balance = (newArray) => {
    if (newArray.length === 0) return;

    const midPoint = Math.floor(newArray.length / 2);
    const midValue = newArray[midPoint];
    bst.insert(midValue);

    balance(newArray.slice(0, midPoint));
    balance(newArray.slice(midPoint + 1));
  };

  balance(newArray);
  return bst;
};

const arrayCleanDup = (array) => {
  return Array.from(new Set(array)).sort((a, b) => a - b);
};

const reBalance = (BinarySearchTree) => {
  let array = BinarySearchTree.preOrder(BinarySearchTree.root);
  return buildTree(array);
};

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const odin = () => {
  const randomArray = Array.from({ length: 100 }, () =>
    Math.floor(Math.random() * 1000)
  );
  let output = new BinarySearchTree();
  output = buildTree(randomArray);

  console.log("Is the tree balance", output.isBalance(output.root));

  let preOrderOutput = output.preOrder(output.root);
  console.log(preOrderOutput);
  let postOrderOutput = output.postOrder(output.root);
  console.log(postOrderOutput);
  let inOrderOutput = output.inOrder(output.root);
  console.log(inOrderOutput);

  for (let i = 0; i < 100; i++) {
    output.insert(Math.floor(Math.random() * 1000) + 1);
  }

  console.log("Is the tree now balance", output.isBalance(output.root));

  output = reBalance(output);

  console.log("Is the tree now balance", output.isBalance(output.root));
  console.log(prettyPrint(output.root));
};

odin();
