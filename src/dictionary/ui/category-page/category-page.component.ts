import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { DictionaryApiService } from '../../infrastructure/dictionary-api.service';
import { DictionaryApiCategory } from '../../infrastructure/models/dictionary-api.model';
import { DictionaryContent } from '../../domain/dictionary.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../environments/environment.development';

const googleGenerativeAI = new GoogleGenerativeAI(environment.API_GEMINI);
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  respnseType: 'text/plain',
};

const model = googleGenerativeAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  ...generationConfig,
});

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css',
})
export class CategoryPageComponent implements OnInit {
  _dictionaryApiService = inject(DictionaryApiService);
  _httpClient = inject(HttpClient);

  result = signal('');
  isLoading = signal(false);

  @Input() cat!: string;

  // inicializamos array de CategoryPage
  category: DictionaryContent[] = [];
  selectedCat: DictionaryContent | null = null;

  ngOnInit() {
    const formatCategory = (cat: string) => {
      return cat
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
    };

    const category: DictionaryApiCategory = {
      category: formatCategory(this.cat),
    };
    console.log(category);
    this._dictionaryApiService.getContent(category).subscribe((data) => {
      this.category = data;
      console.log(this.category);
    });
  }

  async openModal(cat: DictionaryContent) {
    this.selectedCat = cat;
    this.isLoading.set(true);

    await this.TestGemini(cat.class, cat.name);
    (
      document.getElementById('learnMoreModal') as HTMLDialogElement
    ).showModal();
    this.isLoading.set(false);
  }

  async TestGemini(category: string, name: string) {
    const prompt = `Proporciona información de la categoría '${category}' en el lenguaje de señas mexicano. Incluye datos curiosos o historia o cualquier otro detalle relevante sobre la seña '${name}'.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    this.result.set(response.text());
  }
}
