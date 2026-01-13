package com.nvd.library.controllers;

import com.nvd.library.dto.CommentDTO;
import com.nvd.library.pojo.Book;
import com.nvd.library.pojo.Comment;
import com.nvd.library.pojo.User;
import com.nvd.library.services.BookService;
import com.nvd.library.services.CommentService;
import com.nvd.library.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiCommentController {
    @Autowired
    private CommentService commentService;
    @Autowired
    private BookService bookService;
    @Autowired
    private UserService userService;
    @GetMapping("/comments")
    public ResponseEntity<Page<Comment>> getComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(commentService.getAllComments(pageable));
    }

    @GetMapping("/comment/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable int id){
        return ResponseEntity.ok(this.commentService.getCommentById(id));
    }
    @GetMapping("/comment/{id}/userId")
    public ResponseEntity<List<?>> getUserByCommentId(@PathVariable int id){
        return ResponseEntity.ok(this.commentService.getCommentByUserId(id));
    }

    @GetMapping("/comment/{id}/bookId")
    public ResponseEntity<List<?>> getCommentByBookID(@PathVariable int id){
        return ResponseEntity.ok(this.commentService.getCommentByBookId(id));
    }
    @PostMapping("/comment/add")
    public ResponseEntity<Comment> addcomment(@RequestBody CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setCommentText(commentDTO.getCommentText());
        comment.setCommentDate(commentDTO.getCommentDate());
        User user = userService.getUserById(commentDTO.getUserId());
        comment.setUser(user);
        Book book = bookService.getBookById(commentDTO.getBookId());
        comment.setBook(book);
        return ResponseEntity.ok(this.commentService.addComment(comment));
    }

    @PatchMapping("/comment/update")
    public ResponseEntity<Comment> updateComment(@RequestBody CommentDTO commentDTO) {
        Comment comment = commentService.getCommentById(commentDTO.getId());
        comment.setCommentText(commentDTO.getCommentText());
        comment.setCommentDate(commentDTO.getCommentDate());
        User user = userService.getUserById(commentDTO.getUserId());
        comment.setUser(user);
        Book book = bookService.getBookById(commentDTO.getBookId());
        comment.setBook(book);
        this.commentService.updateComment(comment);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/comment/{id}/delete")
    public ResponseEntity<String> deleteComment(@PathVariable int id) {
        this.commentService.deleteComment(id);
        return ResponseEntity.ok("Deleted");
    }
}
