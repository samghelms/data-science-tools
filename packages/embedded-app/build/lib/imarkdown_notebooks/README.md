# IMarkdown notebooks

Markdown notebooks for interactive computing. Like RMarkdown, but for many languages.

`jupyter imarkdown`

# TODO:

1. create a new kernel instance for new files
2. add ability to stop execution



```python
d
```
<div class="p-Widget jp-RenderedText jp-OutputArea-output" data-mime-type="application/vnd.jupyter.stderr"><pre><span class="ansi-red-fg">---------------------------------------------------------------------------</span>&#10;<span class="ansi-red-fg">NameError</span>                                 Traceback (most recent call last)&#10;<span class="ansi-green-fg">&lt;ipython-input-2-e983f374794d&gt;</span> in <span class="ansi-cyan-fg">&lt;module&gt;</span>&#10;<span class="ansi-green-fg">----&gt; 1</span><span class="ansi-red-fg"> </span>d&#10;&#10;<span class="ansi-red-fg">NameError</span>: name 'd' is not defined</pre></div>


```python
import pandas as pd
pd.DataFrame({1: list(range(100))})
```
<div class="p-Widget jp-RenderedHTMLCommon jp-RenderedHTML jp-OutputArea-output jp-OutputArea-executeResult" data-mime-type="text/html"><div>&#10;&#10;<table border="1" class="dataframe">&#10;  <thead>&#10;    <tr style="text-align:right;">&#10;      <th></th>&#10;      <th>1</th>&#10;    </tr>&#10;  </thead>&#10;  <tbody>&#10;    <tr>&#10;      <th>0</th>&#10;      <td>0</td>&#10;    </tr>&#10;    <tr>&#10;      <th>1</th>&#10;      <td>1</td>&#10;    </tr>&#10;    <tr>&#10;      <th>2</th>&#10;      <td>2</td>&#10;    </tr>&#10;    <tr>&#10;      <th>3</th>&#10;      <td>3</td>&#10;    </tr>&#10;    <tr>&#10;      <th>4</th>&#10;      <td>4</td>&#10;    </tr>&#10;    <tr>&#10;      <th>5</th>&#10;      <td>5</td>&#10;    </tr>&#10;    <tr>&#10;      <th>6</th>&#10;      <td>6</td>&#10;    </tr>&#10;    <tr>&#10;      <th>7</th>&#10;      <td>7</td>&#10;    </tr>&#10;    <tr>&#10;      <th>8</th>&#10;      <td>8</td>&#10;    </tr>&#10;    <tr>&#10;      <th>9</th>&#10;      <td>9</td>&#10;    </tr>&#10;    <tr>&#10;      <th>10</th>&#10;      <td>10</td>&#10;    </tr>&#10;    <tr>&#10;      <th>11</th>&#10;      <td>11</td>&#10;    </tr>&#10;    <tr>&#10;      <th>12</th>&#10;      <td>12</td>&#10;    </tr>&#10;    <tr>&#10;      <th>13</th>&#10;      <td>13</td>&#10;    </tr>&#10;    <tr>&#10;      <th>14</th>&#10;      <td>14</td>&#10;    </tr>&#10;    <tr>&#10;      <th>15</th>&#10;      <td>15</td>&#10;    </tr>&#10;    <tr>&#10;      <th>16</th>&#10;      <td>16</td>&#10;    </tr>&#10;    <tr>&#10;      <th>17</th>&#10;      <td>17</td>&#10;    </tr>&#10;    <tr>&#10;      <th>18</th>&#10;      <td>18</td>&#10;    </tr>&#10;    <tr>&#10;      <th>19</th>&#10;      <td>19</td>&#10;    </tr>&#10;    <tr>&#10;      <th>20</th>&#10;      <td>20</td>&#10;    </tr>&#10;    <tr>&#10;      <th>21</th>&#10;      <td>21</td>&#10;    </tr>&#10;    <tr>&#10;      <th>22</th>&#10;      <td>22</td>&#10;    </tr>&#10;    <tr>&#10;      <th>23</th>&#10;      <td>23</td>&#10;    </tr>&#10;    <tr>&#10;      <th>24</th>&#10;      <td>24</td>&#10;    </tr>&#10;    <tr>&#10;      <th>25</th>&#10;      <td>25</td>&#10;    </tr>&#10;    <tr>&#10;      <th>26</th>&#10;      <td>26</td>&#10;    </tr>&#10;    <tr>&#10;      <th>27</th>&#10;      <td>27</td>&#10;    </tr>&#10;    <tr>&#10;      <th>28</th>&#10;      <td>28</td>&#10;    </tr>&#10;    <tr>&#10;      <th>29</th>&#10;      <td>29</td>&#10;    </tr>&#10;    <tr>&#10;      <th>...</th>&#10;      <td>...</td>&#10;    </tr>&#10;    <tr>&#10;      <th>70</th>&#10;      <td>70</td>&#10;    </tr>&#10;    <tr>&#10;      <th>71</th>&#10;      <td>71</td>&#10;    </tr>&#10;    <tr>&#10;      <th>72</th>&#10;      <td>72</td>&#10;    </tr>&#10;    <tr>&#10;      <th>73</th>&#10;      <td>73</td>&#10;    </tr>&#10;    <tr>&#10;      <th>74</th>&#10;      <td>74</td>&#10;    </tr>&#10;    <tr>&#10;      <th>75</th>&#10;      <td>75</td>&#10;    </tr>&#10;    <tr>&#10;      <th>76</th>&#10;      <td>76</td>&#10;    </tr>&#10;    <tr>&#10;      <th>77</th>&#10;      <td>77</td>&#10;    </tr>&#10;    <tr>&#10;      <th>78</th>&#10;      <td>78</td>&#10;    </tr>&#10;    <tr>&#10;      <th>79</th>&#10;      <td>79</td>&#10;    </tr>&#10;    <tr>&#10;      <th>80</th>&#10;      <td>80</td>&#10;    </tr>&#10;    <tr>&#10;      <th>81</th>&#10;      <td>81</td>&#10;    </tr>&#10;    <tr>&#10;      <th>82</th>&#10;      <td>82</td>&#10;    </tr>&#10;    <tr>&#10;      <th>83</th>&#10;      <td>83</td>&#10;    </tr>&#10;    <tr>&#10;      <th>84</th>&#10;      <td>84</td>&#10;    </tr>&#10;    <tr>&#10;      <th>85</th>&#10;      <td>85</td>&#10;    </tr>&#10;    <tr>&#10;      <th>86</th>&#10;      <td>86</td>&#10;    </tr>&#10;    <tr>&#10;      <th>87</th>&#10;      <td>87</td>&#10;    </tr>&#10;    <tr>&#10;      <th>88</th>&#10;      <td>88</td>&#10;    </tr>&#10;    <tr>&#10;      <th>89</th>&#10;      <td>89</td>&#10;    </tr>&#10;    <tr>&#10;      <th>90</th>&#10;      <td>90</td>&#10;    </tr>&#10;    <tr>&#10;      <th>91</th>&#10;      <td>91</td>&#10;    </tr>&#10;    <tr>&#10;      <th>92</th>&#10;      <td>92</td>&#10;    </tr>&#10;    <tr>&#10;      <th>93</th>&#10;      <td>93</td>&#10;    </tr>&#10;    <tr>&#10;      <th>94</th>&#10;      <td>94</td>&#10;    </tr>&#10;    <tr>&#10;      <th>95</th>&#10;      <td>95</td>&#10;    </tr>&#10;    <tr>&#10;      <th>96</th>&#10;      <td>96</td>&#10;    </tr>&#10;    <tr>&#10;      <th>97</th>&#10;      <td>97</td>&#10;    </tr>&#10;    <tr>&#10;      <th>98</th>&#10;      <td>98</td>&#10;    </tr>&#10;    <tr>&#10;      <th>99</th>&#10;      <td>99</td>&#10;    </tr>&#10;  </tbody>&#10;</table>&#10;<p>100 rows × 1 columns</p>&#10;</div></div>

```python
x
```
<div class="p-Widget jp-RenderedText jp-OutputArea-output" data-mime-type="application/vnd.jupyter.stderr"><pre><span class="ansi-red-fg">---------------------------------------------------------------------------</span>&#10;<span class="ansi-red-fg">NameError</span>                                 Traceback (most recent call last)&#10;<span class="ansi-green-fg">&lt;ipython-input-1-6fcf9dfbd479&gt;</span> in <span class="ansi-cyan-fg">&lt;module&gt;</span>&#10;<span class="ansi-green-fg">----&gt; 1</span><span class="ansi-red-fg"> </span>x&#10;&#10;<span class="ansi-red-fg">NameError</span>: name 'x' is not defined</pre></div>

```python {kernel: data_cleaning}
x = 5
import pandas as pd
pd.DataFrame({'d': list(range(100))})
```
<div class="p-Widget jp-RenderedHTMLCommon jp-RenderedHTML jp-OutputArea-output jp-OutputArea-executeResult" data-mime-type="text/html"><div>&#10;&#10;<table border="1" class="dataframe">&#10;  <thead>&#10;    <tr style="text-align:right;">&#10;      <th></th>&#10;      <th>d</th>&#10;    </tr>&#10;  </thead>&#10;  <tbody>&#10;    <tr>&#10;      <th>0</th>&#10;      <td>0</td>&#10;    </tr>&#10;    <tr>&#10;      <th>1</th>&#10;      <td>1</td>&#10;    </tr>&#10;    <tr>&#10;      <th>2</th>&#10;      <td>2</td>&#10;    </tr>&#10;    <tr>&#10;      <th>3</th>&#10;      <td>3</td>&#10;    </tr>&#10;    <tr>&#10;      <th>4</th>&#10;      <td>4</td>&#10;    </tr>&#10;    <tr>&#10;      <th>5</th>&#10;      <td>5</td>&#10;    </tr>&#10;    <tr>&#10;      <th>6</th>&#10;      <td>6</td>&#10;    </tr>&#10;    <tr>&#10;      <th>7</th>&#10;      <td>7</td>&#10;    </tr>&#10;    <tr>&#10;      <th>8</th>&#10;      <td>8</td>&#10;    </tr>&#10;    <tr>&#10;      <th>9</th>&#10;      <td>9</td>&#10;    </tr>&#10;    <tr>&#10;      <th>10</th>&#10;      <td>10</td>&#10;    </tr>&#10;    <tr>&#10;      <th>11</th>&#10;      <td>11</td>&#10;    </tr>&#10;    <tr>&#10;      <th>12</th>&#10;      <td>12</td>&#10;    </tr>&#10;    <tr>&#10;      <th>13</th>&#10;      <td>13</td>&#10;    </tr>&#10;    <tr>&#10;      <th>14</th>&#10;      <td>14</td>&#10;    </tr>&#10;    <tr>&#10;      <th>15</th>&#10;      <td>15</td>&#10;    </tr>&#10;    <tr>&#10;      <th>16</th>&#10;      <td>16</td>&#10;    </tr>&#10;    <tr>&#10;      <th>17</th>&#10;      <td>17</td>&#10;    </tr>&#10;    <tr>&#10;      <th>18</th>&#10;      <td>18</td>&#10;    </tr>&#10;    <tr>&#10;      <th>19</th>&#10;      <td>19</td>&#10;    </tr>&#10;    <tr>&#10;      <th>20</th>&#10;      <td>20</td>&#10;    </tr>&#10;    <tr>&#10;      <th>21</th>&#10;      <td>21</td>&#10;    </tr>&#10;    <tr>&#10;      <th>22</th>&#10;      <td>22</td>&#10;    </tr>&#10;    <tr>&#10;      <th>23</th>&#10;      <td>23</td>&#10;    </tr>&#10;    <tr>&#10;      <th>24</th>&#10;      <td>24</td>&#10;    </tr>&#10;    <tr>&#10;      <th>25</th>&#10;      <td>25</td>&#10;    </tr>&#10;    <tr>&#10;      <th>26</th>&#10;      <td>26</td>&#10;    </tr>&#10;    <tr>&#10;      <th>27</th>&#10;      <td>27</td>&#10;    </tr>&#10;    <tr>&#10;      <th>28</th>&#10;      <td>28</td>&#10;    </tr>&#10;    <tr>&#10;      <th>29</th>&#10;      <td>29</td>&#10;    </tr>&#10;    <tr>&#10;      <th>...</th>&#10;      <td>...</td>&#10;    </tr>&#10;    <tr>&#10;      <th>70</th>&#10;      <td>70</td>&#10;    </tr>&#10;    <tr>&#10;      <th>71</th>&#10;      <td>71</td>&#10;    </tr>&#10;    <tr>&#10;      <th>72</th>&#10;      <td>72</td>&#10;    </tr>&#10;    <tr>&#10;      <th>73</th>&#10;      <td>73</td>&#10;    </tr>&#10;    <tr>&#10;      <th>74</th>&#10;      <td>74</td>&#10;    </tr>&#10;    <tr>&#10;      <th>75</th>&#10;      <td>75</td>&#10;    </tr>&#10;    <tr>&#10;      <th>76</th>&#10;      <td>76</td>&#10;    </tr>&#10;    <tr>&#10;      <th>77</th>&#10;      <td>77</td>&#10;    </tr>&#10;    <tr>&#10;      <th>78</th>&#10;      <td>78</td>&#10;    </tr>&#10;    <tr>&#10;      <th>79</th>&#10;      <td>79</td>&#10;    </tr>&#10;    <tr>&#10;      <th>80</th>&#10;      <td>80</td>&#10;    </tr>&#10;    <tr>&#10;      <th>81</th>&#10;      <td>81</td>&#10;    </tr>&#10;    <tr>&#10;      <th>82</th>&#10;      <td>82</td>&#10;    </tr>&#10;    <tr>&#10;      <th>83</th>&#10;      <td>83</td>&#10;    </tr>&#10;    <tr>&#10;      <th>84</th>&#10;      <td>84</td>&#10;    </tr>&#10;    <tr>&#10;      <th>85</th>&#10;      <td>85</td>&#10;    </tr>&#10;    <tr>&#10;      <th>86</th>&#10;      <td>86</td>&#10;    </tr>&#10;    <tr>&#10;      <th>87</th>&#10;      <td>87</td>&#10;    </tr>&#10;    <tr>&#10;      <th>88</th>&#10;      <td>88</td>&#10;    </tr>&#10;    <tr>&#10;      <th>89</th>&#10;      <td>89</td>&#10;    </tr>&#10;    <tr>&#10;      <th>90</th>&#10;      <td>90</td>&#10;    </tr>&#10;    <tr>&#10;      <th>91</th>&#10;      <td>91</td>&#10;    </tr>&#10;    <tr>&#10;      <th>92</th>&#10;      <td>92</td>&#10;    </tr>&#10;    <tr>&#10;      <th>93</th>&#10;      <td>93</td>&#10;    </tr>&#10;    <tr>&#10;      <th>94</th>&#10;      <td>94</td>&#10;    </tr>&#10;    <tr>&#10;      <th>95</th>&#10;      <td>95</td>&#10;    </tr>&#10;    <tr>&#10;      <th>96</th>&#10;      <td>96</td>&#10;    </tr>&#10;    <tr>&#10;      <th>97</th>&#10;      <td>97</td>&#10;    </tr>&#10;    <tr>&#10;      <th>98</th>&#10;      <td>98</td>&#10;    </tr>&#10;    <tr>&#10;      <th>99</th>&#10;      <td>99</td>&#10;    </tr>&#10;  </tbody>&#10;</table>&#10;<p>100 rows × 1 columns</p>&#10;</div></div>


```python {kernel: data_cleaning}

```

```python {kernel: data_cleaning}

```

Priorities:

Isolate kernels to specific files

List kernel specs

fix syntax highlighting for markdown, add code completion

get rid of react router? Seems like overkill, causing unnecessary page refreshes.

Indicator if file is dirty or not

renaming will currently change your kernel

add clear output

add resizable output areas -- add border box outline as well