import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../../core/models/comment.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {
  animate, animateChild,
  group,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation
} from "@angular/animations";
import {flashAnimation} from "../../animations/flash.animation";
import {slideAndFadeAnimation} from "../../animations/slide-and-fade.animation";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@listItem', [
          stagger(50, [
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('listItem', [
      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(201, 157, 242)',
        'z-index': 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
      // transition('void => *', [
      //   style({
      //     transform: 'translateX(-100%)',
      //     opacity: 0,
      //     'background-color': 'rgb(201, 157, 242)',
      //   }),
      //   animate('250ms ease-out', style({
      //     transform: 'translateX(0)',
      //     opacity: 1,
      //     'background-color': 'white',
      //   }))
      // ]),
      transition(':enter', [
        query('.comment-text, .comment-date', [
          style({
            opacity: 0
          })
        ]),
        useAnimation(slideAndFadeAnimation, {
          params: {
            time: '5004ms',
            startColor: 'rgb(201, 157, 242)'
          }
        }),
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'rgb(249,179,111)'
            }
          }),
          query('.comment-text', [
            animate('250ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('500ms', style({
              opacity: 1
            }))
          ]),
        ]),
      ])
    ])
  ]
})
export class CommentsComponent implements OnInit {

  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();

  animationStates: { [key: number]: 'default' | 'active' } = {};

  commentCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);

    for (let index in this.comments) {
      this.animationStates[index] = 'default';
    }
  }

  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }
    const maxId = Math.max(...this.comments.map(comment => comment.id));
    this.comments.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    });
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  onListItemMouseEnter(key: number) {
    this.animationStates[key] = 'active';
  }

  onListItemMouseLeave(key: number) {
    this.animationStates[key] = 'default';
  }

}
