import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, FormControl, NgForm } from "@angular/forms";

import { ActivatedRoute } from "@angular/router";
import { VideoPageModel } from "../video/video.page";
import { VideoManagementService } from "../../../../providers/video-management.service";
import {
  SafeResourceUrl,
  DomSanitizer,
  SafeHtml
} from "@angular/platform-browser";

@Component({
  selector: "app-video-detail",
  templateUrl: "./video-detail.page.html",
  styleUrls: ["./video-detail.page.scss"]
})
export class VideoDetailPageModel implements OnInit {
  public video: any;
  public folderName;
  public video_url: SafeResourceUrl;
  public source;
  public insta_url: SafeResourceUrl;

  constructor(
    public modalController: ModalController,
    public toast: ToastController,
    private _formBuilder: FormBuilder,
    private _videoManagementService: VideoManagementService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.source == "youtube") {
      this.getYouTubeVideoId(this.video.videoUrl);
    } else if (this.source == "instagram") {
      this.instaVideo(this.video.videoUrl);
    }else if (this.source == "facebook") {
      this.instaVideo(this.video.videoUrl);
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  getYouTubeVideoId(url) {
    // debugger
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get("v");
    this.video_url = this.getSafeUrl(id);
  }

  getSafeUrl(videoId: string): SafeResourceUrl {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // open edit video model
  async editVideo(data: any) {
    const modal = await this.modalController.create({
      component: VideoPageModel,
      componentProps: {
        data: data
      }
    });
    modal.onDidDismiss().then(dataReturned => {});
    return await modal.present();
  }

  instaVideo(url) {
    let iUrl = `${url}/embed`;
    console.log(iUrl)
    const cleanUrl = this.cleanInstagramURL(iUrl);
    this.insta_url = this.sanitizer.bypassSecurityTrustResourceUrl(cleanUrl);
  }

   cleanInstagramURL(url) {
    return url.replace(/\/\?[^\/]*/, '');
}
}
