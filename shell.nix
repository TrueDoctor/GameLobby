with import <nixpkgs> { };

mkShell {
  name = "game-lobby";
  buildInputs = [
    python3
    nodejs
  ];
}
