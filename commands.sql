CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7),
('Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD215.html', 'Go To Statement Considered Harmful', 5);